import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";
// PUT → update lead
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await request.json();

    // Only update allowed fields
    const updateFields: any = {};
    if ("status" in body) updateFields.status = body.status;
    if ("priority" in body) updateFields.priority = body.priority;
    if ("assignedAgents" in body) updateFields.assignedAgents = body.assignedAgents;
    if ("notes" in body) updateFields.notes = body.notes;
    if ("followUpDate" in body) updateFields.followUpDate = body.followUpDate;

    const updatedLead = await Lead.findByIdAndUpdate(params.id, updateFields, { new: true })
      .populate("assignedAgents", "name email")
      .populate("propertyId", "title type")
      .lean();

    if (!updatedLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedLead }, { status: 200 });
  } catch (error) {
    console.error("Failed to update lead:", error);
    return NextResponse.json({ success: false, error: "Failed to update lead" }, { status: 500 });
  }
}

// DELETE → delete lead
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deleted = await Lead.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return NextResponse.json({ success: false, error: "Failed to delete lead" }, { status: 500 });
  }
}
