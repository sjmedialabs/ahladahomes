import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/lib/models/Property"
import User from "@/lib/models/User"

// ✅ GET /api/properties/:id → fetch single property with agents
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const property = await Property.findById(params.id)
      .populate("amenities").lean()

    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: property })
  } catch (error: any) {
    console.error("Failed to fetch property:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ PUT /api/properties/:id → update property
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    const body = await req.json()
    // Auto calculate price per sqft on update
    if (body.area && body.price) {
      body.pricePerSqft = Math.round(body.price / body.area);
    }
    const updated = await Property.findByIdAndUpdate(params.id, body, { new: true })
      .populate("amenities").lean()

    if (!updated) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error: any) {
    console.error("Failed to update property:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// ✅ DELETE /api/properties/:id → delete property
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()

    const deleted = await Property.findByIdAndDelete(params.id)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Property deleted successfully" })
  } catch (error: any) {
    console.error("Failed to delete property:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
