import { type NextRequest, NextResponse } from "next/server"
import { users } from "@/lib/data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const role = searchParams.get("role")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit")
    const offset = searchParams.get("offset")

    let filteredUsers = [...users]

    // Filter by role
    if (role && role !== "all") {
      filteredUsers = filteredUsers.filter((user) => user.role === role)
    }

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase()
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchLower) ||
          user.lastName.toLowerCase().includes(searchLower) ||
          user.email.toLowerCase().includes(searchLower),
      )
    }

    // Remove passwords from response
    const safeUsers = filteredUsers.map(({ password, ...user }) => user)

    // Pagination
    const limitNum = limit ? Number.parseInt(limit) : 10
    const offsetNum = offset ? Number.parseInt(offset) : 0
    const paginatedUsers = safeUsers.slice(offsetNum, offsetNum + limitNum)

    return NextResponse.json({
      users: paginatedUsers,
      total: safeUsers.length,
      limit: limitNum,
      offset: offsetNum,
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    const requiredFields = ["firstName", "lastName", "email", "role"]
    for (const field of requiredFields) {
      if (!userData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    // Check if email already exists
    const existingUser = users.find((user) => user.email === userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Generate new user
    const newUser = {
      userId: `user-${Date.now()}`,
      password: "defaultPassword123", // In real app, hash this
      ...userData,
    }

    // Remove password from response
    const { password, ...safeUser } = newUser

    return NextResponse.json(
      {
        user: safeUser,
        message: "User created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
