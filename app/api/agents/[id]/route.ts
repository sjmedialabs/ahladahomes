import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import UserModel from "@/lib/models/User"
import Property from "@/lib/models/Property"
import type { User } from "@/lib/types"

// ✅ GET /api/agents/:id → fetch agent with assigned properties
export async function GET(req: Request, { params }: { params: { _id: string } }) {
  try {
    await connectDB()
    const agent = await UserModel.findById(params._id)
      .populate("assignedProperties", "title location price status images")
      .lean<User | null>()

    if (!agent || agent.role !== "agent") {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 })
    }

    return NextResponse.json(agent, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch agent" }, { status: 500 })
  }
}
// update agent details
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }   // ✅ match folder name [id]
) {
  try {
    await connectDB();
    const body = await req.json();
    const updateData: Partial<User> = { ...body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    console.log("Updating agent with ID:", params.id);  // Debug log
    const updatedAgent = await UserModel.findByIdAndUpdate(
      params.id,   // ✅ use params.id (not _id)
      updateData,
      { new: true }
    )
      .populate("assignedProperties", "title location price status images")
      .lean<User | null>();

    if (!updatedAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAgent, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


// ✅ DELETE /api/agents/:id
// ✅ DELETE /api/agents/:id
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    //const { id } = params; // ✅ no await needed

    //console.log("Deleting agent with ID:", params.id); // Debug log

    const deleted = await UserModel.findByIdAndDelete(params.id);

    //console.log("Deleted agent:", deleted); // Debug log

    if (!deleted) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    await Property.updateMany(
      { _id: { $in: deleted.assignedProperties } },
      { $pull: { assignedAgents: deleted._id } }
    );

    return NextResponse.json(
      { message: "Agent deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Delete agent error:", err);
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 500 }
    );
  }
}


