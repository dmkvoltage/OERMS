import { NextResponse } from "next/server"
import { adminFunctions } from "@/lib/supabase-admin"

// Setup endpoint to create initial admin users
export async function POST() {
  try {
    // Create default ministry admin
    const ministryAdmin = await adminFunctions.createUser({
      email: "ministry@education.cm",
      password: "admin123!",
      role: "ministry",
      first_name: "Ministry",
      last_name: "Administrator",
      phone: "+237677000001",
    })

    // Create default exam body admin
    const examBodyAdmin = await adminFunctions.createUser({
      email: "examboard@gce.cm",
      password: "admin123!",
      role: "exam_body",
      first_name: "Exam Board",
      last_name: "Administrator",
      phone: "+237677000002",
    })

    return NextResponse.json({
      message: "Setup completed successfully",
      users: [
        { email: ministryAdmin.user.email, role: "ministry" },
        { email: examBodyAdmin.user.email, role: "exam_body" },
      ],
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ error: "Setup failed" }, { status: 500 })
  }
}
