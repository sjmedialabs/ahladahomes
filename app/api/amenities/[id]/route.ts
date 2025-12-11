import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Amenity from "@/lib/models/Amenity";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const data = await req.json();

    const updated = await Amenity.findByIdAndUpdate(params.id, data, { new: true });

    if (!updated)
      return NextResponse.json({ success: false, error: "Amenity not found" }, { status: 404 });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT /api/amenities/[id] ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deleted = await Amenity.findByIdAndDelete(params.id);

    if (!deleted)
      return NextResponse.json({ success: false, error: "Amenity not found" }, { status: 404 });

    return NextResponse.json({
      success: true,
      message: "Amenity deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE /api/amenities/[id] ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
