// import type { Property, BlogPost, ContactSubmission, SiteSettings, User, Lead } from "./types"

// // In-memory data store (in production, this would be replaced with database)
// class DataStore {
//   private properties: Property[] = []
//   private blogPosts: BlogPost[] = []
//   private contactSubmissions: ContactSubmission[] = []
//   private leads: Lead[] = [] // Added leads storage
//   private users: User[] = []
//   private siteSettings: SiteSettings

//   constructor() {
//     this.initializeData()
//   }

//   private initializeData() {
//     // Initialize with sample data
//     this.siteSettings = {
//       id: "1",
//       siteName: "Propmediate",
//       siteDescription: "Your trusted real estate partner",
//       contactEmail: "info@propmediate.com",
//       contactPhone: "+1 (555) 123-4567",
//       address: "123 Real Estate Ave, City, State 12345",
//       socialMedia: {
//         facebook: "https://facebook.com/propmediate",
//         twitter: "https://twitter.com/propmediate",
//         instagram: "https://instagram.com/propmediate",
//         linkedin: "https://linkedin.com/company/propmediate",
//       },
//       heroTitle: "Find Your Dream Property",
//       heroSubtitle: "Discover the perfect home with our expert guidance and comprehensive property listings.",
//       heroImage: "/images/hero-bg.jpg",
//       aboutText: "We are a leading real estate company dedicated to helping you find your perfect property.",
//       servicesText: "Our comprehensive services include property sales, rentals, and investment consulting.",
//       aboutUsPage: {
//         bannerImage: "/images/banner.png",
//         pageTitle: "About Us",
//         welcomeTitle: "Welcome to Propmediate.",
//         introText:
//           "At Propmediate, we connect people with their dream properties through trust, transparency, and expertise. Since our inception, we've been committed to redefining the real estate experience by offering tailored property solutions and client-focused services.",
//         detailedDescription:
//           "As one of the leading real estate consultancies, Propmediate specializes in residential, commercial and investment properties. With a strong presence in Hyderabad and expanding footprints across key locations, our mission is to make property buying, selling and renting seamless, secure and rewarding.",
//         visionImage: "/images/vision.png",
//         visionTitle: "Our Vision",
//         visionText:
//           "At Propmediate, our vision is to become a trusted leader in the real estate industry by providing transparent, reliable, and client-centric property solutions. We aim to empower individuals and businesses with the right property choices that enhance lifestyles, create wealth, and build thriving communities.",
//         missionImage: "/images/mission.png",
//         missionTitle: "Our Mission",
//         missionText:
//           "Our mission is to simplify real estate for everyone—buyers, sellers, and investors—through expert guidance, innovative solutions, and a commitment to trust and transparency. By combining industry expertise with personalized service, we strive to make every property transaction seamless, rewarding and future-ready.",
//         statistics: {
//           yearsExperience: "7+",
//           partnerships: "50+",
//           propertiesClosed: "1000+",
//           happyClients: "500+",
//         },
//         whyChooseTitle: "Choose us",
//         whyChooseSubtitle: "Why Choose Propmediate?",
//         features: [
//           {
//             title: "Expert Property Advisors",
//             description:
//               "Work with experienced real estate professionals who guide you with market insights and tailored property solutions.",
//           },
//           {
//             title: "Transparent Deals",
//             description:
//               "Experience a smooth property journey with clear documentation, fair pricing, and hassle-free processes.",
//           },
//           {
//             title: "Dedicated Support System",
//             description:
//               "From property search to final handover, our team ensures end-to-end assistance at every step.",
//           },
//           {
//             title: "Partnerships with Builders & Developers",
//             description:
//               "Gain access to exclusive projects and trusted collaborations with top builders, ensuring premium property options.",
//           },
//           {
//             title: "Trusted by Clients",
//             description:
//               "Join thousands of satisfied buyers and investors have successfully secured properties through Propmediate's trusted guidance.",
//           },
//           {
//             title: "Wide Property Network",
//             description:
//               "Explore diverse property listings across residential, commercial and investment properties for better opportunities.",
//           },
//         ],
//       },
//     }

//     // Initialize with sample properties
//     this.properties = [
//       {
//         id: "1",
//         title: "Modern Luxury Apartment",
//         description: "Beautiful modern apartment with stunning city views and premium amenities.",
//         price: 850000,
//         location: "Downtown, City Center",
//         bedrooms: 3,
//         bathrooms: 2,
//         area: 1200,
//         type: "apartment",
//         status: "for-sale",
//         images: ["/modern-apartment-aerial.png", "/luxury-property-interior-.jpg"],
//         features: ["City View", "Modern Kitchen", "Parking", "Gym Access", "Balcony"],
//         agent: {
//           name: "Sarah Johnson",
//           phone: "+1 (555) 123-4567",
//           email: "sarah@propmediate.com",
//           image: "/agent-sarah.jpg",
//         },
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         featured: true,
//       },
//       {
//         id: "2",
//         title: "Luxury Residential Tower",
//         description: "Premium residential tower with world-class amenities and breathtaking views.",
//         price: 1200000,
//         location: "Uptown District",
//         bedrooms: 4,
//         bathrooms: 3,
//         area: 1800,
//         type: "apartment",
//         status: "for-sale",
//         images: ["/luxury-residential-tower.jpg", "/premium-housing-complex.jpg"],
//         features: ["Ocean View", "Concierge", "Pool", "Spa", "Private Elevator"],
//         agent: {
//           name: "Michael Chen",
//           phone: "+1 (555) 987-6543",
//           email: "michael@propmediate.com",
//           image: "/agent-michael.jpg",
//         },
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//         featured: true,
//       },
//     ]

//     this.users = [
//       {
//         id: "super-admin-1",
//         name: "Super Admin",
//         email: "admin@propmediate.com",
//         phone: "+1 (555) 000-0000",
//         password: "password123", // Plain text for v0 preview
//         role: "super_admin",
//         status: "active",
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//       {
//         id: "agent-1",
//         name: "Sarah Johnson",
//         email: "sarah@propmediate.com",
//         phone: "+1 (555) 123-4567",
//         password: "agent123",
//         role: "agent",
//         status: "active",
//         assignedProperties: ["1"],
//         agentInfo: {
//           specialties: ["Luxury Properties", "Commercial Real Estate"],
//           experience: "5 years",
//           languages: ["English", "Spanish"],
//           bio: "Experienced real estate agent specializing in luxury properties.",
//         },
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//       {
//         id: "agent-2",
//         name: "Michael Chen",
//         email: "michael@propmediate.com",
//         phone: "+1 (555) 987-6543",
//         password: "agent123",
//         role: "agent",
//         status: "active",
//         assignedProperties: ["2"],
//         agentInfo: {
//           specialties: ["Residential Properties", "First-time Buyers"],
//           experience: "3 years",
//           languages: ["English", "Mandarin"],
//           bio: "Dedicated agent helping first-time buyers find their dream homes.",
//         },
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString(),
//       },
//     ]

//     this.leads = [
//       {
//         id: "lead-1",
//         name: "John Smith",
//         email: "john.smith@email.com",
//         phone: "+1 (555) 111-2222",
//         message: "Interested in the luxury apartment downtown",
//         propertyId: "1",
//         type: "property-inquiry",
//         status: "new",
//         assignedAgentId: "agent-1",
//         priority: "high",
//         source: "website",
//         notes: [],
//         createdAt: new Date().toISOString(),
//       },
//       {
//         id: "lead-2",
//         name: "Emma Davis",
//         email: "emma.davis@email.com",
//         phone: "+1 (555) 333-4444",
//         message: "Looking for a family home with good schools nearby",
//         type: "general",
//         status: "contacted",
//         assignedAgentId: "agent-2",
//         priority: "medium",
//         source: "referral",
//         notes: ["Called on 2025-01-20", "Scheduled viewing for next week"],
//         createdAt: new Date().toISOString(),
//       },
//     ]
//   }

//   // Properties CRUD
//   getProperties(): Property[] {
//     return this.properties
//   }

//   getProperty(id: string): Property | undefined {
//     return this.properties.find((p) => p.id === id)
//   }

//   createProperty(property: Omit<Property, "id" | "createdAt" | "updatedAt">): Property {
//     const newProperty: Property = {
//       ...property,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }
//     this.properties.push(newProperty)
//     return newProperty
//   }

//   updateProperty(id: string, updates: Partial<Property>): Property | null {
//     const index = this.properties.findIndex((p) => p.id === id)
//     if (index === -1) return null

//     this.properties[index] = {
//       ...this.properties[index],
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     }
//     return this.properties[index]
//   }

//   deleteProperty(id: string): boolean {
//     const index = this.properties.findIndex((p) => p.id === id)
//     if (index === -1) return false

//     this.properties.splice(index, 1)
//     return true
//   }

//   // Contact Submissions CRUD
//   getContactSubmissions(): ContactSubmission[] {
//     return this.contactSubmissions
//   }

//   createContactSubmission(submission: Omit<ContactSubmission, "id" | "createdAt">): ContactSubmission {
//     const newSubmission: ContactSubmission = {
//       ...submission,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//     }
//     this.contactSubmissions.push(newSubmission)
//     return newSubmission
//   }

//   updateContactSubmission(id: string, updates: Partial<ContactSubmission>): ContactSubmission | null {
//     const index = this.contactSubmissions.findIndex((s) => s.id === id)
//     if (index === -1) return null

//     this.contactSubmissions[index] = { ...this.contactSubmissions[index], ...updates }
//     return this.contactSubmissions[index]
//   }

//   // Site Settings
//   getSiteSettings(): SiteSettings {
//     return this.siteSettings
//   }

//   updateSiteSettings(updates: Partial<SiteSettings>): SiteSettings {
//     this.siteSettings = { ...this.siteSettings, ...updates }
//     return this.siteSettings
//   }

//   // Blog Posts CRUD
//   getBlogPosts(): BlogPost[] {
//     return this.blogPosts
//   }

//   createBlogPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): BlogPost {
//     const newPost: BlogPost = {
//       ...post,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }
//     this.blogPosts.push(newPost)
//     return newPost
//   }

//   // Users CRUD
//   getUsers(): User[] {
//     return this.users
//   }

//   getUser(id: string): User | undefined {
//     return this.users.find((u) => u.id === id)
//   }

//   getUserByEmail(email: string): User | undefined {
//     return this.users.find((u) => u.email === email)
//   }

//   createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): User {
//     const newUser: User = {
//       ...user,
//       id: Date.now().toString(),
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString(),
//     }
//     this.users.push(newUser)
//     return newUser
//   }

//   updateUser(id: string, updates: Partial<User>): User | null {
//     const index = this.users.findIndex((u) => u.id === id)
//     if (index === -1) return null

//     this.users[index] = {
//       ...this.users[index],
//       ...updates,
//       updatedAt: new Date().toISOString(),
//     }
//     return this.users[index]
//   }

//   deleteUser(id: string): boolean {
//     const index = this.users.findIndex((u) => u.id === id)
//     if (index === -1) return false

//     this.users.splice(index, 1)
//     return true
//   }

//   // Lead management methods
//   getLeads(): Lead[] {
//     return this.leads
//   }

//   getLeadsByAgent(agentId: string): Lead[] {
//     return this.leads.filter((lead) => lead.assignedAgentId === agentId)
//   }

//   createLead(lead: Omit<Lead, "id" | "createdAt">): Lead {
//     const newLead: Lead = {
//       ...lead,
//       id: `lead-${Date.now()}`,
//       createdAt: new Date().toISOString(),
//     }
//     this.leads.push(newLead)
//     return newLead
//   }

//   updateLead(id: string, updates: Partial<Lead>): Lead | null {
//     const index = this.leads.findIndex((l) => l.id === id)
//     if (index === -1) return null

//     this.leads[index] = { ...this.leads[index], ...updates }
//     return this.leads[index]
//   }

//   deleteLead(id: string): boolean {
//     const index = this.leads.findIndex((l) => l.id === id)
//     if (index === -1) return false

//     this.leads.splice(index, 1)
//     return true
//   }

//   assignLeadToAgent(leadId: string, agentId: string): Lead | null {
//     return this.updateLead(leadId, { assignedAgentId: agentId })
//   }
// }

// // Singleton instance
// export const dataStore = new DataStore()
