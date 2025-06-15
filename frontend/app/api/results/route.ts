import { type NextRequest, NextResponse } from "next/server"
import { results, getResultsByStudentId } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get("studentId")
    const examId = searchParams.get("examId")
    const published = searchParams.get("published")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    let filteredResults = [...results]

    // Filter by student ID
    if (studentId) {
      filteredResults = getResultsByStudentId(studentId)
    }

    // Filter by exam ID
    if (examId) {
      filteredResults = filteredResults.filter((result) => result.examId === examId)
    }

    // Filter by published status
    if (published !== null) {
      const isPublished = published === "true"
      filteredResults = filteredResults.filter((result) => result.isPublished === isPublished)
    }

    // Pagination
    const limitNum = limit ? Number.parseInt(limit) : 10
    const offsetNum = offset ? Number.parseInt(offset) : 0
    const paginatedResults = filteredResults.slice(offsetNum, offsetNum + limitNum)

    return NextResponse.json({
      results: paginatedResults,
      total: filteredResults.length,
      limit: limitNum,
      offset: offsetNum,
    })
  } catch (error) {
    console.error("Get results error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const resultData = await request.json()

    // Validate required fields
    const requiredFields = ["studentId", "examId", "score"]
    for (const field of requiredFields) {
      if (resultData[field] === undefined) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Calculate grade based on score
    const calculateGrade = (score: number) => {
      if (score >= 90) return "A+"
      if (score >= 80) return "A"
      if (score >= 70) return "B+"
      if (score >= 60) return "B"
      if (score >= 50) return "C"
      if (score >= 40) return "D"
      return "F"
    }

    // Generate new result
    const newResult = {
      resultId: `res-${Date.now()}`,
      grade: calculateGrade(resultData.score),
      isPublished: false,
      ...resultData,
    }

    return NextResponse.json(
      {
        result: newResult,
        message: "Result created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create result error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
