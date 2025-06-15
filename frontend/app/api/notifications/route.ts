import { type NextRequest, NextResponse } from "next/server"
import { notifications, getNotificationsByUserId } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const isRead = searchParams.get("isRead")
    const type = searchParams.get("type")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    let filteredNotifications = [...notifications]

    // Filter by user ID
    if (userId) {
      filteredNotifications = getNotificationsByUserId(userId)
    }

    // Filter by read status
    if (isRead !== null) {
      const readStatus = isRead === "true"
      filteredNotifications = filteredNotifications.filter((notif) => notif.isRead === readStatus)
    }

    // Filter by type
    if (type && type !== "all") {
      filteredNotifications = filteredNotifications.filter((notif) => notif.type === type)
    }

    // Sort by date (newest first)
    filteredNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Pagination
    const limitNum = limit ? Number.parseInt(limit) : 10
    const offsetNum = offset ? Number.parseInt(offset) : 0
    const paginatedNotifications = filteredNotifications.slice(offsetNum, offsetNum + limitNum)

    return NextResponse.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      unreadCount: filteredNotifications.filter((n) => !n.isRead).length,
      limit: limitNum,
      offset: offsetNum,
    })
  } catch (error) {
    console.error("Get notifications error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const notificationData = await request.json()

    // Validate required fields
    const requiredFields = ["userId", "message", "type"]
    for (const field of requiredFields) {
      if (!notificationData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Generate new notification
    const newNotification = {
      notificationId: `notif-${Date.now()}`,
      date: new Date(),
      isRead: false,
      ...notificationData,
    }

    return NextResponse.json(
      {
        notification: newNotification,
        message: "Notification created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create notification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
