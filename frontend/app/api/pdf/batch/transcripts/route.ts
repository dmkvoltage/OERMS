import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { verifyAuth } from "@/lib/auth"
import { BatchProcessor } from "@/lib/batch-processor"
import type { TranscriptData } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const user = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only allow admin, ministry, or institution_admin roles to perform batch operations
    if (!["admin", "ministry", "institution_admin"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { institutionId, programId, level, graduationYear } = await request.json()

    if (!institutionId) {
      return NextResponse.json({ error: "Institution ID is required" }, { status: 400 })
    }

    const supabase = createClient()

    // If user is institution_admin, verify they belong to the requested institution
    if (user.role === "institution_admin") {
      const { data: adminUser } = await supabase.from("users").select("institution_id").eq("id", user.id).single()

      if (!adminUser?.institution_id || adminUser.institution_id !== institutionId) {
        return NextResponse.json({ error: "You can only generate transcripts for your institution" }, { status: 403 })
      }
    }

    // Build query to fetch students
    let query = supabase
      .from("students")
      .select(`
        id,
        first_name,
        last_name,
        student_id,
        program,
        level,
        graduation_year,
        institutions:institution_id (name)
      `)
      .eq("institution_id", institutionId)

    if (programId) {
      query = query.eq("program_id", programId)
    }

    if (level) {
      query = query.eq("level", level)
    }

    if (graduationYear) {
      query = query.eq("graduation_year", graduationYear)
    }

    const { data: students, error } = await query

    if (error) {
      return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 })
    }

    if (!students || students.length === 0) {
      return NextResponse.json({ error: "No students found matching criteria" }, { status: 404 })
    }

    // Prepare transcript data for each student
    const transcriptsData: TranscriptData[] = []

    for (const student of students) {
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
        .eq("student_id", student.id)
        .eq("is_published", true)
        .order("created_at", { ascending: true })

      if (resultsError || !results || results.length === 0) {
        // Skip students with no results
        continue
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

      transcriptsData.push({
        studentName: `${student.first_name} ${student.last_name}`,
        studentId: student.student_id,
        institution: student.institutions.name,
        program: student.program || "General Studies",
        level: student.level || "Undergraduate",
        results: transcriptResults,
        gpa: gpa,
        totalCredits: totalCredits,
        dateIssued: new Date().toLocaleDateString(),
      })
    }

    if (transcriptsData.length === 0) {
      return NextResponse.json({ error: "No students with published results found" }, { status: 404 })
    }

    // Process transcripts in batch
    const batchResult = await BatchProcessor.processTranscripts(transcriptsData)

    if (!batchResult.zipBlob) {
      return NextResponse.json({ error: "Failed to generate ZIP file" }, { status: 500 })
    }

    // Log the batch operation
    await supabase.from("batch_operations").insert({
      operation_type: "transcript_generation",
      user_id: user.id,
      total_items: transcriptsData.length,
      successful_items: batchResult.successCount,
      failed_items: batchResult.failureCount,
      metadata: {
        institution_id: institutionId,
        program_id: programId,
        level: level,
        graduation_year: graduationYear,
      },
    })

    const buffer = Buffer.from(await batchResult.zipBlob.arrayBuffer())

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="transcripts-institution-${institutionId}.zip"`,
      },
    })
  } catch (error) {
    console.error("Batch transcript generation error:", error)
    return NextResponse.json({ error: "Failed to generate transcripts" }, { status: 500 })
  }
}
