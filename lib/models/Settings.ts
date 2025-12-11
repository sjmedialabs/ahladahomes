import mongoose from "mongoose"

const SettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "Propmediate" },
    siteDescription: String,
    contactEmail: String,
    contactPhone: String,
    contactPhone2: String,
    contactBanner: String,
    websiteUrl: String,
    mapUrl: String,
    address: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    heroTitle: String,
    heroSubtitle: String,
    heroImage: String,
    aboutTitle: String,
    aboutText: String,
    servicesText: String,
    aboutImage: String,
    testimonialsPage: {
      bannerImage: String,
          testimonials: [{
      name: String,
      role: String,
      image: String,
      description: String,
    }],
    },
     aboutContent: [{
      title: String,
      description: String,
    }],
    aboutUsPage: {
      bannerImage: String,
      pageTitle: String,
      welcomeImage: String,
      welcomeTitle: String,
      introText: String,
      detailedDescription: String,
      visionImage: String,
      visionTitle: String,
      visionText: String,
      visionText2: String,
      goalImage: String,
      goalTitle: String,
      goalText: String,
      goalText2: String,
      missionImage: String,
      missionTitle: String,
      missionText: String,
      missionText2: String,
      statistics: {
        yearsExperience: String,
        partnerships: String,
        propertiesClosed: String,
        happyClients: String,
        locations: String,
      }
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema)
