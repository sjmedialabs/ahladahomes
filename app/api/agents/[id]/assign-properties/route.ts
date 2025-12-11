// /app/api/agents/[id]/assign-properties/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import UserModel from "@/lib/models/User";
import PropertyModel from "@/lib/models/Property";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { propertyIds }: { propertyIds: string[] } = await req.json();
    const agentId = params.id;

    // 1️⃣ Update agent assignedProperties
    const agent = await UserModel.findByIdAndUpdate(
      agentId,
      { assignedProperties: propertyIds },
      { new: true }
    );

    if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

    // 2️⃣ Update properties' assignedAgents
    // Remove agent from all properties not in propertyIds
    await PropertyModel.updateMany(
      { assignedAgents: agentId, _id: { $nin: propertyIds } },
      { $pull: { assignedAgents: agentId } }
    );

    // Add agent to newly assigned properties
    await PropertyModel.updateMany(
      { _id: { $in: propertyIds } },
      { $addToSet: { assignedAgents: agentId } }
    );

    return NextResponse.json({ message: "Properties updated successfully" }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
