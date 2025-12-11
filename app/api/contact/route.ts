import { NextRequest, NextResponse } from "next/server";
import mongoose, { Types } from "mongoose";
import connectDB from "@/lib/mongodb";
import Contact from "@/lib/models/Contact";
import Property from "@/lib/models/Property";
import Lead from "@/lib/models/Lead"; // ✅ Imported Lead model

export async function GET() {
  try {
    await connectDB();

    // Fetch all contact submissions, populate related property if any
    const submissions = await Contact.find()
      .populate("propertyId", "title price location type status") // only selected fields
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      submissions.map((s: any) => ({
        ...s,
        id: s._id.toString(),
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Failed to fetch contact submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch contact submissions" },
      { status: 500 }
    );
  }
}
export interface IProperty extends Document {
  title: string;
  type: string;
}
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, message, phone, propertyId } = body;

    // Basic Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    let propertyIdObjectId: Types.ObjectId | null = null;
    let assignedAgents: Types.ObjectId[] = [];

    // ------------------------------------------------------------
    // CASE 1: If propertyId exists → Validate & fetch property
    // ------------------------------------------------------------
    if (propertyId) {
      if (!Types.ObjectId.isValid(propertyId)) {
        return NextResponse.json(
          { error: "Invalid propertyId format." },
          { status: 400 }
        );
      }

      const property = await Property.findById(propertyId).lean<IProperty>();
      if (!property) {
        return NextResponse.json(
          { error: "Property not found." },
          { status: 404 }
        );
      }

      propertyIdObjectId = new Types.ObjectId(propertyId);
      assignedAgents = Array.isArray((property as any).assignedAgents)
        ? (property as any).assignedAgents
        : [];
    }

    // ------------------------------------------------------------
    // ALWAYS CREATE CONTACT ENTRY
    // ------------------------------------------------------------
    const submission = await Contact.create({
      name,
      email,
      phone,
      message,
      propertyId: propertyIdObjectId ?? undefined,
      status: "new",
    });

try {
  await Lead.create({
    name,
    email,
    phone,
    message,
    propertyId: propertyIdObjectId || null,
    assignedAgents: Array.isArray(assignedAgents) ? assignedAgents : [],
    status: "new",
    priority: "low",
    source: propertyIdObjectId ? "property_contact_form" : "general_contact_form",
    notes: [],
  });
} catch (err) {
  console.error("Lead creation failed:", err);
}



    return NextResponse.json(
      {
        message: "Contact form submitted successfully.",
        data: {
          ...submission.toObject(),
          id: submission._id.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Failed to submit contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form." },
      { status: 500 }
    );
  }
}


