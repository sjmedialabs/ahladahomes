import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { AuthService } from "@/lib/auth"
import type { RegisterData, AuthResponse, User as UserType } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body: RegisterData = await request.json()
    const { name, email, phone, password, role } = body

    // Validation
    if (!name || !email || !phone || !password || !role) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "All fields are required",
        },
        { status: 400 },
      )
    }

    if (password.length < 8) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Password must be at least 8 characters long",
        },
        { status: 400 },
      )
    }

    const validRoles: UserType["role"][] = ["super_admin", "agent"]
    if (!validRoles.includes(role)) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "Invalid role specified",
        },
        { status: 400 },
      )
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json<AuthResponse>(
        {
          success: false,
          error: "User with this email already exists",
        },
        { status: 409 },
      )
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password)

    const newUser = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      status: "active",
    })

    // Generate JWT token
    const token = AuthService.generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    })

    // Remove password from response
    const userObject = newUser.toObject()
    const { password: _, ...userWithoutPassword } = userObject

    return NextResponse.json<AuthResponse>(
      {
        success: true,
        user: {
          ...userWithoutPassword,
          id: newUser._id.toString(),
        },
        token,
        message: "User registered successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json<AuthResponse>(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
