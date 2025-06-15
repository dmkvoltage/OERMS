import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const examId = searchParams.get("examId")
    const studentId = searchParams.get("studentId")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const supabase = createServerSupabaseClient()

    let query = supabase.from("registrations").select(`
        *,
        student:users!registrations_student_id_fkey(first_name, last_name, email),
        exam:exams!registrations_exam_id_fkey(name, type, start_date),
        exam_center:exam_centers(name, address, city)
      `)

    // Apply filters
    if (examId) {
      query = query.eq("exam_id", examId)
    }
    if (studentId) {
      query = query.eq("student_id", studentId)
    }
    if (status) {
      query = query.eq("status", status)
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data: registrations, error, count } = await query

    if (error) {
      console.error("Get registrations error:", error)
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }

    return NextResponse.json({
      registrations: registrations || [],
      total: count || 0,
      limit,
      offset,
    })
  } catch (error) {
    console.error("Get registrations error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const registrationData = await request.json()

    // Validate required fields
    const requiredFields = ["student_id", "exam_id", "subjects", "payment_amount"]
    for (const field of requiredFields) {
      if (!registrationData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const supabase = createServerSupabaseClient()

    // Check if registration already exists
    const { data: existingRegistration } = await supabase
      .from("registrations")
      .select("id")
      .eq("student_id", registrationData.student_id)
      .eq("exam_id", registrationData.exam_id)
      .single()

    if (existingRegistration) {
      return NextResponse.json({ error: "Student already registered for this exam" }, { status: 409 })
    }

    // Generate registration number
    const registrationNumber = `REG${Date.now()}`

    const { data: registration, error } = await supabase
      .from("registrations")
      .insert({
        ...registrationData,
        registration_number: registrationNumber,
        status: "pending",
        payment_status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select(`
        *,
        student:users!registrations_student_id_fkey(first_name, last_name, email),
        exam:exams!registrations_exam_id_fkey(name, type, start_date)
      `)
      .single()

    if (error) {
      console.error("Create registration error:", error)
      return NextResponse.json({ error: "Failed to create registration" }, { status: 500 })
    }

    // Create notification for student
    await supabase.from("notifications").insert({
      user_id: registrationData.student_id,
      title: "Registration Submitted",
      message: `Your registration for ${registration.exam?.name} has been submitted and is pending approval.`,
      type: "registration_update",
    })

    return NextResponse.json(
      {
        registration,
        message: "Registration created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
