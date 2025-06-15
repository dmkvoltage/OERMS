import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: template, error } = await supabase
      .from("document_templates")
      .select(`
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
      .eq("id", params.id)
      .single()

    if (error || !template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Template fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    const body = await request.json()
    const { name, layout, header, footer, styling, content, branding } = body

    // Update template
    const { data: template, error } = await supabase
      .from("document_templates")
      .update({
        name,
        layout,
        header,
        footer,
        styling,
        content,
        branding,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating template:", error)
      return NextResponse.json({ error: "Failed to update template" }, { status: 500 })
    }

    return NextResponse.json({ template })
  } catch (error) {
    console.error("Template update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Delete template
    const { error } = await supabase.from("document_templates").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting template:", error)
      return NextResponse.json({ error: "Failed to delete template" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Template deletion error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
