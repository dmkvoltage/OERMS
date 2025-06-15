import { type NextRequest, NextResponse } from "next/server"
import { emailService } from "@/lib/email"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, data } = await request.json()

    let result
    switch (type) {
      case "registration_approval":
        result = await emailService.sendRegistrationApproval(data)
        break
      case "registration_rejection":
        result = await emailService.sendRegistrationRejection(data)
        break
      case "results_notification":
        result = await emailService.sendResultsNotification(data)
        break
      case "exam_reminder":
        result = await emailService.sendExamReminder(data)
        break
      default:
        return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    // Log email activity
    await supabase.from("notifications").insert({
      user_id: data.studentId || user.id,
      type: "email",
      title: `Email sent: ${type}`,
      message: `Email notification sent successfully`,
      metadata: { email_type: type, message_id: result.messageId },
    })

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Email API error:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
