import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"

// ✅ GET /api/agents → Fetch all agents
export async function GET() {
  try {
    // Connect to MongoDB
    await connectDB()

    // Fetch all users with role "agent"
    const agents = await User.find({ role: "agent" }).lean()

    // Return agents as JSON
    return NextResponse.json(agents, { status: 200 })
  } catch (error) {
    // Return error if fetching fails
    return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 })
  }
}

// ✅ POST /api/agents → Create a new agent
export async function POST(req: Request) {
  try {
    // Connect to MongoDB
    await connectDB()

    // Parse the request body
    const body = await req.json()
    const { name, email, phone, password, status, agentInfo } = body

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new agent in the database
    const agent = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "agent",        // Fixed role as "agent"
      status: status || "active", // Default status to "active" if not provided
      agentInfo,            // Additional info about agent
    })

    // Return the created agent
    return NextResponse.json(agent, { status: 201 })
  } catch (error: any) {
    // Return error message if creation fails
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}
