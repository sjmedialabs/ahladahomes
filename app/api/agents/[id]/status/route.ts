import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb"
import UserModel from "@/lib/models/User"

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }   // 👈 params is a Promise
) {
  try {
    await connectDB();
    const { status } = await req.json();

    const { id } = await context.params;   // 👈 await it here

    const updatedAgent = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedAgent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAgent, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
