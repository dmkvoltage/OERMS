import { TemplateManager } from "@/components/template-manager"
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

export default async function InstitutionTemplatesPage() {
  const institutionInfo = await getInstitutionInfo()

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">{institutionInfo.institutionName} - Document Templates</h1>

      <TemplateManager institutionId={institutionInfo.institutionId} userRole="institution_admin" />
    </div>
  )
}
