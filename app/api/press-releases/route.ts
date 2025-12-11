import { NextResponse } from "next/server";
import PressRelease from "@/lib/models/PressRelease";
import connectDB from "@/lib/mongodb";

// GET → fetch all press releases
export async function GET() {
  await connectDB();
  const list = await PressRelease.find().sort({ createdAt: -1 });
  return NextResponse.json({ success: true, data: list });
}

// POST → create new press release
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  try {
    const newPress = await PressRelease.create(body);
    return NextResponse.json({ success: true, data: newPress });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
