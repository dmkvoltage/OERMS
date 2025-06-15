import { type NextRequest, NextResponse } from "next/server"
import { PDFGenerator, type CertificateData } from "@/lib/pdf-generator"
import { createClient } from "@/lib/supabase"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { resultId } = await request.json()

    const supabase = createClient()

    // Fetch result with student and exam details
    const { data: result, error } = await supabase
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
      .eq("id", resultId)
      .single()

    if (error || !result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    // Check if user has permission to access this result
    if (user.role === "student" && result.student_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Only generate certificates for passing grades
    if (result.score < 50) {
      return NextResponse.json({ error: "Certificate not available for failing grades" }, { status: 400 })
    }

    const certificateData: CertificateData = {
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
    }

    const pdfBlob = await PDFGenerator.generateCertificate(certificateData)
    const buffer = Buffer.from(await pdfBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${result.students.student_id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Certificate generation error:", error)
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 })
  }
}
