// app/api/properties/[id]/assign-agents/route.ts
import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/lib/models/Property"
import User from "@/lib/models/User"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()

    const { agentIds } = await req.json() // expects { agentIds: ["id1","id2"] }

    if (!Array.isArray(agentIds)) {
      return NextResponse.json({ error: "agentIds must be an array" }, { status: 400 })
    }

    const property = await Property.findById(params.id)
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 })
    }

    // ✅ Update assigned agents
    const oldAgentIds = property.assignedAgents?.map((_id : any) => String(_id)) || []
    property.assignedAgents = agentIds
    await property.save()

    // ✅ Add property to each assigned agent’s assignedProperties array
    await User.updateMany(
      { _id: { $in: agentIds } },
      { $addToSet: { assignedProperties: property._id } }
    )

    // ✅ Remove property from agents who are no longer assigned
    const removedAgents = oldAgentIds.filter((_id : any) => !agentIds.includes(_id))
    if (removedAgents.length > 0) {
      await User.updateMany(
        { _id: { $in: removedAgents } },
        { $pull: { assignedProperties: property._id } }
      )
    }

    // ✅ Populate assigned agents with details for frontend display
    const populatedProperty = await property.populate(
      "assignedAgents",
      "name email phone avatar agentInfo"
    )

    return NextResponse.json(
      {
        message: "Agents assigned successfully",
        property: populatedProperty,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Failed to assign agents:", error)
    return NextResponse.json({ error: "Failed to assign agents" }, { status: 500 })
  }
}
