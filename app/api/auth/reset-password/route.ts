import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { AuthService } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password required" }, { status: 400 })
    }

   const decoded: any = AuthService.verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    await connectDB()
    const user = await User.findById(decoded.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (user.role !== "super_admin") {
      return NextResponse.json({ error: "Only super_admin can reset password" }, { status: 403 })
    }
// Hash password using AuthService
const hashedPassword = await AuthService.hashPassword(password)

user.password = hashedPassword
await user.save()

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (err: any) {
    console.error("Reset password error:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
