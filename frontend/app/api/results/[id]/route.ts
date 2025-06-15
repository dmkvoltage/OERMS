import { type NextRequest, NextResponse } from "next/server"
import { results } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = results.find((r) => r.resultId === params.id)

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    return NextResponse.json({ result })
  } catch (error) {
    console.error("Get result error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const result = results.find((r) => r.resultId === params.id)

    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 })
    }

    // Update result
    const updatedResult = {
      ...result,
      ...updateData,
      resultId: params.id,
    }

    return NextResponse.json({
      result: updatedResult,
      message: "Result updated successfully",
    })
  } catch (error) {
    console.error("Update result error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
