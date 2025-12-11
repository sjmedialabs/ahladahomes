import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Amenity from "@/lib/models/Amenity";

export async function GET() {
  try {
    await connectDB();
    const amenities = await Amenity.find({}).sort({ category: 1 });

    return NextResponse.json({ success: true, data: amenities });
  } catch (error: any) {
    console.error("GET /api/amenities ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const amenity = await Amenity.create(body);

    return NextResponse.json({ success: true, data: amenity }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/amenities ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
