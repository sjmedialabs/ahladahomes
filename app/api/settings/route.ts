import { type NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Settings from "@/lib/models/Settings"
import type { SiteSettings } from "@/lib/types"
import mongoose from "mongoose"

export async function GET() {
  try {
    await connectDB()

    let settings = await Settings.findOne().lean()

    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        siteName: "BNRHomes",
        siteDescription: "Your trusted real estate partner",
      })
    }

    // If settings is an array, use the first element
    if (Array.isArray(settings)) {
      settings = settings[0]
    }

    const data: SiteSettings = {
      ...settings,
      id: settings && settings._id ? settings._id.toString() : "",
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Failed to fetch site settings:", error)
    return NextResponse.json(
      { error: "Failed to fetch site settings" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const body = await request.json()

    // Check if settings already exist
    const existing = await Settings.findOne()
    if (existing) {
      return NextResponse.json(
        { message: "Settings already exist. Use PUT to update instead." },
        { status: 400 }
      )
    }

    // Create a new settings document
    const newSettings = await Settings.create({
      _id: new mongoose.Types.ObjectId().toString(),
      siteName: body.siteName || "Propmediate",
      siteDescription: body.siteDescription || "Your trusted real estate partner",
      contactEmail: body.contactEmail || "contact@propmediate.com",
      contactPhone: body.contactPhone || "",
      contactPhone2: body.contactPhone2 || "",
      contactBanner: body.contactBanner || "",
      websiteUrl: body.websiteUrl || "",
      mapUrl: body.mapUrl || "",
      address: body.address || "",
      socialMedia: body.socialMedia || {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
      },
      heroTitle: body.heroTitle || "",
      heroSubtitle: body.heroSubtitle || "",
      heroImage: body.heroImage || "",
      aboutTitle: body.aboutTitle || "",
      aboutText: body.aboutText || "",
      servicesText: body.servicesText || "",
      aboutImage: body.aboutImage || "",
      aboutContent: body.aboutContent || [],
      testimonialsPage: body.testimonialsPage || {
        bannerImage: "",
        testimonials: [
          {
            name: "",
            role: "",
            image: "",
            description: "",
          }
        ],
      },
      aboutUsPage: body.aboutUsPage || {
        bannerImage: "",
        pageTitle: "",
        welcomeImage: "",
        welcomeTitle: "",
        introText: "",
        detailedDescription: "",
        visionImage: "",
        visionTitle: "",
        visionText: "",
        visionText2: "",
        goalImage: "",
        goalTitle: "",
        goalText: "",
        goalText2: "",
        missionImage: "",
        missionTitle: "",
        missionText: "",
        missionText2: "",
        statistics: {
          yearsExperience: "",
          partnerships: "",
          propertiesClosed: "",
          happyClients: "",
          locations: "",
        }
      },
    })

    const data: SiteSettings = {
      ...newSettings.toObject(),
      id: newSettings._id.toString(),
    }

    return NextResponse.json({
      message: "CMS settings created successfully",
      data,
    })
  } catch (error) {
    console.error("Failed to create initial settings:", error)
    return NextResponse.json(
      { error: "Failed to create initial settings" },
      { status: 500 }
    )
  }
}
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    let settings = await Settings.findOne();

    if (!settings) {
      // Create new document
      settings = await Settings.create({ ...body });
    } else {
      // Update fields safely
      Object.keys(body).forEach((key) => {
        settings[key] = body[key];
      });
      await settings.save();
    }

    return NextResponse.json({
      message: "Site settings updated successfully",
      data: { ...settings.toObject(), id: settings._id.toString() },
    });
  } catch (error) {
    console.error("Failed to update site settings:", error);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}


