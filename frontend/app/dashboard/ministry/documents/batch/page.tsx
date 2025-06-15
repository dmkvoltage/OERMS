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

export default async function MinistryBatchDocumentsPage() {
  const institutions = await getInstitutions()
  const exams = await getExams()
  const programs = await getPrograms()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Ministry Batch Document Generation</h1>

      <BatchDocumentGenerator institutions={institutions} exams={exams} programs={programs} userRole="ministry" />
    </div>
  )
}
