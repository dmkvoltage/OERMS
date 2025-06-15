import { type NextRequest, NextResponse } from "next/server"
import { getInstitutionById } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const institution = getInstitutionById(params.id)

    if (!institution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 })
    }

    return NextResponse.json({ institution })
  } catch (error) {
    console.error("Get institution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const institution = getInstitutionById(params.id)

    if (!institution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 })
    }

    // Update institution
    const updatedInstitution = {
      ...institution,
      ...updateData,
      id: params.id,
    }

    return NextResponse.json({
      institution: updatedInstitution,
      message: "Institution updated successfully",
    })
  } catch (error) {
    console.error("Update institution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const institution = getInstitutionById(params.id)

    if (!institution) {
      return NextResponse.json({ error: "Institution not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Institution deleted successfully",
    })
  } catch (error) {
    console.error("Delete institution error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
