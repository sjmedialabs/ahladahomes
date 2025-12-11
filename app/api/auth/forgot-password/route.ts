import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import jwt from "jsonwebtoken"
import nodemailer from "nodemailer"
import { AuthService } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 })

    await connectDB()
    console.log("Searching for user with email:", email)
    const user = await User.findOne({ email })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (user.role !== "super_admin")
      return NextResponse.json({ error: "Only super_admins can reset passwords" }, { status: 403 })
    console.log("User found for password reset:", user.email)
    // Generate reset token
    // ✅ Generate token using AuthService
    const token = AuthService.generateToken(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
    )
    console.log("Generated reset token:", token)
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
    console.log("Password reset link:", resetLink)
    // Send Email (using Nodemailer)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    })
    console.log("Sending email to:", user.email)
    await transporter.sendMail({
      to: user.email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    })
    console.log("Password reset email sent to:", user.email)
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
