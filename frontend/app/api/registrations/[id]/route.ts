import { type NextRequest, NextResponse } from "next/server"
import { examRegistrations } from "@/lib/data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const registration = examRegistrations.find((reg) => reg.registrationId === params.id)

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({ registration })
  } catch (error) {
    console.error("Get registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updateData = await request.json()
    const registration = examRegistrations.find((reg) => reg.registrationId === params.id)

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Update registration
    const updatedRegistration = {
      ...registration,
      ...updateData,
      registrationId: params.id,
    }

    return NextResponse.json({
      registration: updatedRegistration,
      message: "Registration updated successfully",
    })
  } catch (error) {
    console.error("Update registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const registration = examRegistrations.find((reg) => reg.registrationId === params.id)

    if (!registration) {
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Registration deleted successfully",
    })
  } catch (error) {
    console.error("Delete registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
