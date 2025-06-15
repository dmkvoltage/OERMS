import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { reason } = await request.json()

    // In real implementation, update database
    const updatedRegistration = {
      id: params.id,
      status: "rejected",
      rejectedDate: new Date().toISOString(),
      rejectionReason: reason || "No reason provided",
    }

    return NextResponse.json({
      registration: updatedRegistration,
      message: "Registration rejected successfully",
    })
  } catch (error) {
    console.error("Reject registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
