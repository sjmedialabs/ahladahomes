import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get("email")

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 })

    await connectDB()
    const user = await User.findOne({ email }).select("role")

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json({ role: user.role })
  } catch (err) {
    console.error("Error checking role:", err)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
