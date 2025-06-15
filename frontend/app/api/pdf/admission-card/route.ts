import { type NextRequest, NextResponse } from "next/server"
import { PDFGenerator, type AdmissionCardData } from "@/lib/pdf-generator"
import { createClient } from "@/lib/supabase"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { registrationId } = await request.json()

    const supabase = createClient()

    // Fetch registration with student and exam details
    const { data: registration, error } = await supabase
      .from("exam_registrations")
      .select(`
        *,
        students:student_id (
          first_name,
          last_name,
          student_id,
          profile_photo
        ),
        exams:exam_id (
          title,
          exam_code,
          date,
          start_time,
          subjects,
          exam_centers
        )
      `)
      .eq("id", registrationId)
      .single()

    if (error || !registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Check if user has permission to access this registration
    if (user.role === "student" && registration.student_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Only generate admission cards for approved registrations
    if (registration.status !== "approved") {
      return NextResponse.json({ error: "Admission card only available for approved registrations" }, { status: 400 })
    }

    const examCenter = registration.exams.exam_centers?.[0] || {
      name: "Main Examination Center",
      address: "To be announced",
    }

    const admissionCardData: AdmissionCardData = {
      studentName: `${registration.students.first_name} ${registration.students.last_name}`,
      studentId: registration.students.student_id,
      examName: registration.exams.title,
      examCode: registration.exams.exam_code,
      examDate: new Date(registration.exams.date).toLocaleDateString(),
      examTime: registration.exams.start_time || "08:00 AM",
      examCenter: examCenter.name,
      centerAddress: examCenter.address,
      subjects: registration.exams.subjects || [],
      instructions: [
        "Arrive at the examination center 30 minutes before the scheduled time",
        "Bring a valid photo ID (National ID Card, Passport, or Student ID)",
        "No electronic devices are allowed in the examination hall",
        "Use only blue or black ink pens for writing",
        "Mobile phones must be switched off and kept outside the examination hall",
        "Follow all instructions given by the examination supervisors",
        "Any form of malpractice will result in disqualification",
      ],
      photo: registration.students.profile_photo,
    }

    const pdfBlob = await PDFGenerator.generateAdmissionCard(admissionCardData)
    const buffer = Buffer.from(await pdfBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="admission-card-${registration.students.student_id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Admission card generation error:", error)
    return NextResponse.json({ error: "Failed to generate admission card" }, { status: 500 })
  }
}
