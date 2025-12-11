import { NextResponse } from "next/server";
import PressRelease from "@/lib/models/PressRelease";
import connectDB from "@/lib/mongodb";

// GET single press release
export async function GET(req: Request, { params }: any) {
  await connectDB();
  const press = await PressRelease.findById(params.id);

  if (!press) {
    return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true, data: press });
}

// UPDATE
export async function PUT(req: Request, { params }: any) {
  await connectDB();
  const body = await req.json();

  try {
    const updated = await PressRelease.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// DELETE
export async function DELETE(req: Request, { params }: any) {
  await connectDB();

  try {
    await PressRelease.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
