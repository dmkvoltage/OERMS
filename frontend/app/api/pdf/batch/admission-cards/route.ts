import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { verifyAuth } from "@/lib/auth"
import { BatchProcessor } from "@/lib/batch-processor"
import type { AdmissionCardData } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow admin, ministry, or exam body roles to perform batch operations
    if (!["admin", "ministry", "exam_body", "institution_admin"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { examId, institutionId } = await request.json()

    if (!examId) {
      return NextResponse.json({ error: "Exam ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Build query to fetch registrations
    let query = supabase
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
      .eq("exam_id", examId)
      .eq("status", "approved") // Only approved registrations

    // Filter by institution if provided
    if (institutionId) {
      query = query.eq("institution_id", institutionId)
    }

    // If user is institution_admin, restrict to their institution
    if (user.role === "institution_admin") {
      const { data: adminUser } = await supabase.from("users").select("institution_id").eq("id", user.id).single()

      if (!adminUser?.institution_id) {
        return NextResponse.json({ error: "Institution not found for admin" }, { status: 400 })
      }

      query = query.eq("institution_id", adminUser.institution_id)
    }

    const { data: registrations, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }

    if (!registrations || registrations.length === 0) {
      return NextResponse.json({ error: "No approved registrations found" }, { status: 404 })
    }

    // Prepare admission card data for each registration
    const admissionCardsData: AdmissionCardData[] = registrations.map((registration) => {
      const examCenter = registration.exams.exam_centers?.[0] || {
        name: "Main Examination Center",
        address: "To be announced",
      }

      return {
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
    })

    // Process admission cards in batch
    const batchResult = await BatchProcessor.processAdmissionCards(admissionCardsData)

    if (!batchResult.zipBlob) {
      return NextResponse.json({ error: "Failed to generate ZIP file" }, { status: 500 })
    }

    // Log the batch operation
    await supabase.from("batch_operations").insert({
      operation_type: "admission_card_generation",
      user_id: user.id,
      total_items: admissionCardsData.length,
      successful_items: batchResult.successCount,
      failed_items: batchResult.failureCount,
      metadata: {
        exam_id: examId,
        institution_id: institutionId,
      },
    })

    const buffer = Buffer.from(await batchResult.zipBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="admission-cards-exam-${examId}.zip"`,
      },
    })
  } catch (error) {
    console.error("Batch admission card generation error:", error)
    return NextResponse.json({ error: "Failed to generate admission cards" }, { status: 500 })
  }
}
