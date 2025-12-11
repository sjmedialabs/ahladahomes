import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Property from "@/lib/models/Property"
import "@/lib/models/Amenity"
// ✅ GET /api/properties → Fetch all properties (with optional filters)
export async function GET(request: Request) {
  try {
    await connectDB();

    const properties = await Property.find({})
      .populate("amenities")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: properties });
  } catch (error) {
    console.error("Failed to fetch properties:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// ✅ POST /api/properties → Create a new property
export async function POST(request: Request) {
  try {
    await connectDB()
    const body = await request.json()
    console.log("Request body for post api:", body);
    // Auto calculate price per sqft if missing
    if (body.area && body.price) {
      body.pricePerSqft = Math.round(body.price / body.area);
    }
    const property = await Property.create(body)

    return NextResponse.json({ success: true, data: property }, { status: 201 })
  } catch (error) {
    console.error("Failed to create property:", error)
    return NextResponse.json({ error: "Failed to create property" }, { status: 500 })
  }
}
