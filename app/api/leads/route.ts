import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/lib/models/Lead";
import Property from "@/lib/models/Property";
import mongoose from "mongoose";

// GET → fetch all leads
export async function GET(request: Request) {
  try {
    await connectDB();

    const url = new URL(request.url);
    const status = url.searchParams.get("status"); // optional filter by status

    const filter: any = {};

    // ✅ Filter by status if provided
    if (status && ["new", "contacted", "closed"].includes(status)) {
      filter.status = status;
    }

    // ✅ Fetch leads with populated references
    const leads = await Lead.find(filter)
      .populate("propertyId", "title type") // property info
      .sort({ createdAt: -1 })
      .lean(); // return plain JS objects

    return NextResponse.json({ success: true, data: leads }, { status: 200 });
  } catch (error: any) {
    console.error("Failed to fetch leads:", error.message, error);
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}
export interface IProperty extends Document {
  title: string;
  type: string;
}
// POST → create a new lead

export async function POST(request: Request) {
  try {
    // ✅ Connect to MongoDB
    await connectDB();

    // ✅ Parse the incoming JSON data
    const body = await request.json();

    // ✅ Validate required fields
    if (!body.name || !body.email || !body.propertyId || !body.source) {
      return NextResponse.json(
        { success: false, error: "name, email, propertyId, and source are required" },
        { status: 400 }
      );
    }

    // ✅ Fetch the property to get assigned agents
    const property = await Property.findById(body.propertyId).lean<IProperty>();
    if (!property) {
      return NextResponse.json({ success: false, error: "Property not found" }, { status: 404 });
    }

    // ✅ Create a new Lead instance (as Mongoose Document)
    const newLeadDoc = new Lead({
      name: body.name,
      email: body.email,
      phone: body.phone || "",            // Optional, default to empty string
      message: body.message || "",        // Optional, default to empty string
      source: body.source,
      propertyId: body.propertyId,
      status: body.status || "new",       // Default to "new" if not provided
      priority: body.priority || "low",   // Default to "low" if not provided
      notes: body.notes || [],            // Default empty array
      followUpDate: body.followUpDate || null, // Optional
    });

    // ✅ Save the lead to the database
    await newLeadDoc.save();

    // ✅ Populate the assignedAgents and propertyId fields for readable response
    const populatedLead = await newLeadDoc
      .populate("propertyId", "title type");

    // ✅ Return the created lead
    return NextResponse.json({ success: true, data: populatedLead }, { status: 201 });
  } catch (error: any) {
    // ✅ Log the exact error and return a 500 response
    console.error("Failed to create lead:", error.message, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create lead" },
      { status: 500 }
    );
  }
}

