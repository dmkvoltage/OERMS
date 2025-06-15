import { type NextRequest, NextResponse } from "next/server"
import { results } from "@/lib/data"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = results.find((r) => r.resultId === params.id)

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    if (result.isPublished) {
      return NextResponse.json({ error: "Result is already published" }, { status: 400 })
    }

    // Publish result
    const updatedResult = {
      ...result,
      isPublished: true,
      datePublished: new Date(),
    }

    return NextResponse.json({
      result: updatedResult,
      message: "Result published successfully",
    })
  } catch (error) {
    console.error("Publish result error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
