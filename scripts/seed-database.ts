import connectDB from "../lib/mongodb"
import Property from "../lib/models/Property"
import User from "../lib/models/User"
import Settings from "../lib/models/Settings"
import Lead from "../lib/models/Lead"
import { AuthService } from "../lib/auth"

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...")
    await connectDB()

    console.log("Clearing existing data...")
    await Property.deleteMany({})
    await User.deleteMany({})
    await Settings.deleteMany({})
    await Lead.deleteMany({})

    console.log("Creating users...")
    const hashedPassword = await AuthService.hashPassword("password123")

    const superAdmin = await User.create({
      name: "Super Admin",
      email: "admin@propmediate.com",
      phone: "+1 (555) 000-0000",
      password: hashedPassword,
      role: "super_admin",
      status: "active",
    })

    const agent1 = await User.create({
      name: "Sarah Johnson",
      email: "sarah@propmediate.com",
      phone: "+1 (555) 123-4567",
      password: hashedPassword,
      role: "agent",
      status: "active",
      agentInfo: {
        specialties: ["Luxury Properties", "Commercial Real Estate"],
        experience: "5 years",
        languages: ["English", "Spanish"],
        bio: "Experienced real estate agent specializing in luxury properties.",
      },
    })

    const agent2 = await User.create({
      name: "Michael Chen",
      email: "michael@propmediate.com",
      phone: "+1 (555) 987-6543",
      password: hashedPassword,
      role: "agent",
      status: "active",
      agentInfo: {
        specialties: ["Residential Properties", "First-time Buyers"],
        experience: "3 years",
        languages: ["English", "Mandarin"],
        bio: "Dedicated agent helping first-time buyers find their dream homes.",
      },
    })

    console.log("Creating properties...")
    await Property.create([
      {
        title: "Modern Luxury Apartment",
        description: "Beautiful modern apartment with stunning city views and premium amenities.",
        price: 850000,
        location: "Downtown, City Center",
        bedrooms: 3,
        bathrooms: 2,
        area: 1200,
        type: "apartment",
        status: "for-sale",
        images: ["/modern-apartment-aerial.png", "/luxury-property-interior-.jpg"],
        features: ["City View", "Modern Kitchen", "Parking", "Gym Access", "Balcony"],
        agent: {
          name: agent1.name,
          phone: agent1.phone,
          email: agent1.email,
        },
        featured: true,
      },
      {
        title: "Luxury Residential Tower",
        description: "Premium residential tower with world-class amenities and breathtaking views.",
        price: 1200000,
        location: "Uptown District",
        bedrooms: 4,
        bathrooms: 3,
        area: 1800,
        type: "apartment",
        status: "for-sale",
        images: ["/luxury-residential-tower.jpg", "/premium-housing-complex.jpg"],
        features: ["Ocean View", "Concierge", "Pool", "Spa", "Private Elevator"],
        agent: {
          name: agent2.name,
          phone: agent2.phone,
          email: agent2.email,
        },
        featured: true,
      },
    ])

    console.log("Creating site settings...")
    await Settings.create({
      siteName: "Propmediate",
      siteDescription: "Your trusted real estate partner",
      contactEmail: "info@propmediate.com",
      contactPhone: "+1 (555) 123-4567",
      address: "123 Real Estate Ave, City, State 12345",
      socialMedia: {
        facebook: "https://facebook.com/propmediate",
        twitter: "https://twitter.com/propmediate",
        instagram: "https://instagram.com/propmediate",
        linkedin: "https://linkedin.com/company/propmediate",
      },
      heroTitle: "Find Your Dream Property",
      heroSubtitle: "Discover the perfect home with our expert guidance and comprehensive property listings.",
      heroImage: "/images/hero-bg.jpg",
      aboutText: "We are a leading real estate company dedicated to helping you find your perfect property.",
      servicesText: "Our comprehensive services include property sales, rentals, and investment consulting.",
    })

    console.log("Creating sample leads...")
    await Lead.create([
      {
        name: "John Smith",
        email: "john.smith@email.com",
        phone: "+1 (555) 111-2222",
        message: "Interested in the luxury apartment downtown",
        type: "property-inquiry",
        status: "new",
        assignedAgentId: agent1._id.toString(),
        priority: "high",
        source: "website",
      },
      {
        name: "Emma Davis",
        email: "emma.davis@email.com",
        phone: "+1 (555) 333-4444",
        message: "Looking for a family home with good schools nearby",
        type: "general",
        status: "contacted",
        assignedAgentId: agent2._id.toString(),
        priority: "medium",
        source: "referral",
        notes: ["Called on 2025-01-20", "Scheduled viewing for next week"],
      },
    ])

    console.log("Database seeded successfully!")
    console.log("\nDefault credentials:")
    console.log("Email: admin@propmediate.com")
    console.log("Password: password123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
