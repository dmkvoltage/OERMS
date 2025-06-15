import { BatchDocumentGenerator } from "@/components/batch-document-generator"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

async function getInstitutionInfo() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth")
  }

  const { data, error } = await supabase
    .from("users")
    .select(`
      role,
      institution_id,
      institutions:institution_id (
        id,
        name
      )
    `)
    .eq("id", user.id)
    .single()

  if (error || !data || data.role !== "institution_admin" || !data.institution_id) {
    redirect("/dashboard")
  }

  return {
    institutionId: data.institution_id,
    institutionName: data.institutions.name,
  }
}

async function getExams(institutionId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("exams")
    .select("id, title, exam_code, date")
    .eq("institution_id", institutionId)
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching exams:", error)
    return []
  }

  return data || []
}

async function getPrograms(institutionId: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("programs")
    .select("id, name")
    .eq("institution_id", institutionId)
    .order("name")

  if (error) {
    console.error("Error fetching programs:", error)
    return []
  }

  return data || []
}

export default async function InstitutionBatchDocumentsPage() {
  const institutionInfo = await getInstitutionInfo()
  const exams = await getExams(institutionInfo.institutionId)
  const programs = await getPrograms(institutionInfo.institutionId)

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{institutionInfo.institutionName} - Batch Document Generation</h1>

      <BatchDocumentGenerator
        institutions={[{ id: institutionInfo.institutionId, name: institutionInfo.institutionName }]}
        exams={exams}
        programs={programs}
        userRole="institution_admin"
        institutionId={institutionInfo.institutionId}
      />
    </div>
  )
}
