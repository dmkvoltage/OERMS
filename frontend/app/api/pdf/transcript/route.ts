import { type NextRequest, NextResponse } from "next/server"
import { PDFGenerator, type TranscriptData } from "@/lib/pdf-generator"
import { createClient } from "@/lib/supabase"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { studentId } = await request.json()

    const supabase = createClient()

    // Fetch student details
    const { data: student, error: studentError } = await supabase
      .from("students")
      .select(`
        *,
        institutions:institution_id (name)
      `)
      .eq("id", studentId)
      .single()

    if (studentError || !student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    // Check if user has permission to access this transcript
    if (user.role === "student" && studentId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Fetch all results for the student
    const { data: results, error: resultsError } = await supabase
      .from("results")
      .select(`
        *,
        exams:exam_id (
          title,
          exam_code,
          date,
          credits
        )
      `)
      .eq("student_id", studentId)
      .eq("is_published", true)
      .order("created_at", { ascending: true })

    if (resultsError) {
      return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 })
    }

    if (!results || results.length === 0) {
      return NextResponse.json({ error: "No published results found" }, { status: 404 })
    }

    // Calculate GPA and total credits
    let totalCredits = 0
    let totalGradePoints = 0

    const gradePoints: { [key: string]: number } = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      F: 0.0,
    }

    const transcriptResults = results.map((result) => {
      const credits = result.exams.credits || 3
      const gradePoint = gradePoints[result.grade] || 0

      totalCredits += credits
      totalGradePoints += gradePoint * credits

      return {
        examName: result.exams.title,
        examCode: result.exams.exam_code,
        date: new Date(result.exams.date).toLocaleDateString(),
        score: result.score,
        grade: result.grade,
        credits: credits,
      }
    })

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

    const transcriptData: TranscriptData = {
      studentName: `${student.first_name} ${student.last_name}`,
      studentId: student.student_id,
      institution: student.institutions.name,
      program: student.program || "General Studies",
      level: student.level || "Undergraduate",
      results: transcriptResults,
      gpa: gpa,
      totalCredits: totalCredits,
      dateIssued: new Date().toLocaleDateString(),
    }

    const pdfBlob = await PDFGenerator.generateTranscript(transcriptData)
    const buffer = Buffer.from(await pdfBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="transcript-${student.student_id}.pdf"`,
      },
    })
  } catch (error) {
    console.error("Transcript generation error:", error)
    return NextResponse.json({ error: "Failed to generate transcript" }, { status: 500 })
  }
}
