import { BatchDocumentGenerator } from "@/components/batch-document-generator"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

async function getInstitutions() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("institutions").select("id, name").order("name")

  if (error) {
    console.error("Error fetching institutions:", error)
    return []
  }

  return data || []
}

async function getExams() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from("exams")
    .select("id, title, exam_code, date")
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching exams:", error)
    return []
  }

  return data || []
}

async function getPrograms() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase.from("programs").select("id, name").order("name")

  if (error) {
    console.error("Error fetching programs:", error)
    return []
  }

  return data || []
}

async function getUserRole() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return "guest"
  }

  const { data, error } = await supabase.from("users").select("role, institution_id").eq("id", user.id).single()

  if (error || !data) {
    return "guest"
  }

  return {
    role: data.role,
    institutionId: data.institution_id,
  }
}

export default async function BatchDocumentsPage() {
  const institutions = await getInstitutions()
  const exams = await getExams()
  const programs = await getPrograms()
  const userInfo = await getUserRole()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Batch Document Generation</h1>

      <BatchDocumentGenerator
        institutions={institutions}
        exams={exams}
        programs={programs}
        userRole={userInfo.role}
        institutionId={userInfo.institutionId}
      />
    </div>
  )
}
