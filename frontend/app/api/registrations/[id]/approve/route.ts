import { type NextRequest, NextResponse } from "next/server"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { emailService } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get registration with student and exam details
    const { data: registration, error: fetchError } = await supabase
      .from("registrations")
      .select(`
        *,
        student:users!registrations_student_id_fkey(email, first_name, last_name),
        exam:exams(name, start_date, exam_centers)
      `)
      .eq("id", params.id)
      .single()

    if (fetchError || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    if (registration.status !== "pending") {
      return NextResponse.json({ error: "Registration is not pending approval" }, { status: 400 })
    }

    // Update registration status
    const { data: updatedRegistration, error: updateError } = await supabase
      .from("registrations")
      .update({
        status: "approved",
        approved_at: new Date().toISOString(),
        approved_by: user.id,
      })
      .eq("id", params.id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json({ error: "Failed to approve registration" }, { status: 500 })
    }

    // Send approval email
    try {
      await emailService.sendRegistrationApproval({
        studentEmail: registration.student.email,
        studentName: `${registration.student.first_name} ${registration.student.last_name}`,
        examName: registration.exam.name,
        examDate: new Date(registration.exam.start_date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        examCenter: registration.exam_center || "TBD",
        registrationId: registration.id,
      })
    } catch (emailError) {
      console.error("Failed to send approval email:", emailError)
      // Don't fail the approval if email fails
    }

    // Create notification
    await supabase.from("notifications").insert({
      user_id: registration.student_id,
      type: "success",
      title: "Registration Approved",
      message: `Your registration for ${registration.exam.name} has been approved.`,
      metadata: { registration_id: registration.id },
    })

    return NextResponse.json({
      registration: updatedRegistration,
      message: "Registration approved successfully",
    })
  } catch (error) {
    console.error("Approve registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
