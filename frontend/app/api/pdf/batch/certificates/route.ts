import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { verifyAuth } from "@/lib/auth"
import { BatchProcessor } from "@/lib/batch-processor"
import type { CertificateData } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow admin, ministry, or exam body roles to perform batch operations
    if (!["admin", "ministry", "exam_body"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { examId, institutionId, minScore = 50 } = await request.json()

    if (!examId) {
      return NextResponse.json({ error: "Exam ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // Build query to fetch results
    let query = supabase
      .from("results")
      .select(`
        *,
        students:student_id (
          first_name,
          last_name,
          student_id,
          institutions:institution_id (name)
        ),
        exams:exam_id (
          title,
          exam_code,
          date
        )
      `)
      .eq("exam_id", examId)
      .eq("is_published", true)
      .gte("score", minScore) // Only passing scores

    // Filter by institution if provided
    if (institutionId) {
      query = query.eq("students.institution_id", institutionId)
    }

    const { data: results, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
    }

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "No qualifying results found" }, { status: 404 })
    }

    // Prepare certificate data for each result
    const certificatesData: CertificateData[] = results.map((result) => ({
      studentName: `${result.students.first_name} ${result.students.last_name}`,
      studentId: result.students.student_id,
      examName: result.exams.title,
      examCode: result.exams.exam_code,
      grade: result.grade,
      score: result.score,
      dateIssued: new Date().toLocaleDateString(),
      certificateNumber: `CERT-${result.id}-${new Date().getFullYear()}`,
      institution: result.students.institutions.name,
      examDate: new Date(result.exams.date).toLocaleDateString(),
    }))

    // Process certificates in batch
    const batchResult = await BatchProcessor.processCertificates(certificatesData)

    if (!batchResult.zipBlob) {
      return NextResponse.json({ error: "Failed to generate ZIP file" }, { status: 500 })
    }

    // Log the batch operation
    await supabase.from("batch_operations").insert({
      operation_type: "certificate_generation",
      user_id: user.id,
      total_items: certificatesData.length,
      successful_items: batchResult.successCount,
      failed_items: batchResult.failureCount,
      metadata: {
        exam_id: examId,
        institution_id: institutionId,
        min_score: minScore,
      },
    })

    const buffer = Buffer.from(await batchResult.zipBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="certificates-exam-${examId}.zip"`,
      },
    })
  } catch (error) {
    console.error("Batch certificate generation error:", error)
    return NextResponse.json({ error: "Failed to generate certificates" }, { status: 500 })
  }
}
