import { type NextRequest, NextResponse } from "next/server"
import { notifications } from "@/lib/data"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const notification = notifications.find((n) => n.notificationId === params.id)

    if (!notification) {
      return NextResponse.json({ error: "Notification not found" }, { status: 404 })
    }

    // Mark as read
    const updatedNotification = {
      ...notification,
      isRead: true,
    }

    return NextResponse.json({
      notification: updatedNotification,
      message: "Notification marked as read",
    })
  } catch (error) {
    console.error("Mark notification as read error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
