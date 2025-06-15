import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, institution_id")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const templateType = searchParams.get("type")
    const institutionId = searchParams.get("institutionId")

    let query = supabase.from("document_templates").select(`
        *,
        institutions:institution_id (
          id,
          name
        ),
        template_assets (
          id,
          asset_type,
          file_name,
          file_url
        )
      `)

    // Apply filters based on user role
    if (userData.role === "institution_admin") {
      query = query.eq("institution_id", userData.institution_id)
    } else if (userData.role === "ministry_admin" || userData.role === "admin") {
      // Ministry admins can see all templates
      if (institutionId) {
        query = query.eq("institution_id", institutionId)
      }
    } else {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    if (templateType) {
      query = query.eq("template_type", templateType)
    }

    const { data: templates, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching templates:", error)
      return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 })
    }

    return NextResponse.json({ templates })
  } catch (error) {
    console.error("Template fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, institution_id")
      .eq("id", user.id)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const body = await request.json()
    const { institution_id, template_type, name, layout, header, footer, styling, content, branding } = body

    // Validate permissions
    if (userData.role === "institution_admin" && institution_id !== userData.institution_id) {
      return NextResponse.json({ error: "Can only create templates for your institution" }, { status: 403 })
    }

    if (userData.role !== "ministry_admin" && userData.role !== "admin" && userData.role !== "institution_admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Create template
    const { data: template, error } = await supabase
      .from("document_templates")
      .insert({
        institution_id,
        template_type,
        name,
        layout,
        header,
        footer,
        styling,
        content,
        branding,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating template:", error)
      return NextResponse.json({ error: "Failed to create template" }, { status: 500 })
    }

    return NextResponse.json({ template }, { status: 201 })
  } catch (error) {
    console.error("Template creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
