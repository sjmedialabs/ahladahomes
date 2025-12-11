// ================== PROPERTY ==================
export interface Video {
  videoUrl: string
  thumbnailUrl: string
}
export type Tower = {
  name: string;          // Tower A, Tower B, etc.
  floors?: number;
  units?: number;
  floorPlans: string[];  // uploaded images
  facing?: string;
};
export type Amenity = {
  _id?: string;
  title: string;
  image?: string;
  category:
    | "building"
    | "recreational"
    | "indoor"
    | "outdoor"
    | "safety"
    | "convenience"
    | "connectivity"
    | "farming"
    | "others";
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};
export type Property = {
  _id?: string;
  createdAt?: string;
  updatedAt?: string;

  /* BASIC INFORMATION */
  title: string;
  subtitle?: string;
  description: string;
  price: number;
  pricePerSqft: number;
  location: string;
  city?: string;
  area: number;

  type: "apartment" | "villa" | "commercial" | "open-plot" | "farm-land";
  status: "for-sale" | "for-rent" | "sold" | "rented";

  images: string[];
  videos?: Video[];
  broucher?:{
    brochureLink: string,
    brochureThumbnail1: string,
    brochureThumbnail2: string,
    brochureThumbnail3: string,
    },

  facing?: string;
  totalFloors?: number;
  furnished?: "unfurnished" | "semi-furnished" | "furnished";
  possession?: string;
  reraNumber?: string;
  developerName?: string;
  featured: boolean;

  highlights?: string[];

  /* NEW AMENITY SYSTEM */
  amenities: string[]; // Array of Amenity IDs

  /* FLOOR PLAN SYSTEM */
  supportsFloorPlans?: boolean;
  hasTowers?: boolean;

  towers?: Tower[];

  floorPlans?: string[]; // Used when hasTowers = false

  masterPlan?: string;
  locationMap?: string;
  /* APARTMENT DETAILS */
  apartmentDetails?: {
    bhkType?:
      | "studio"
      | "1bhk"
      | "2bhk"
      | "3bhk"
      | "4bhk"
      | "5+bhk"
      | "penthouse";
    towers?: number;
    floorsPerTower?: number;
    totalUnits?: number;
    possessionDate?: string;
    bedrooms?: number;
    bathrooms?: number;
    balconies?: number;

    specifications?: {
      doors?: string;
      windows?: string;
      flooring?: string;
      kitchen?: string;
      bathroom?: string;
      electrical?: string;
      walls?: string;
    };
  };

  /* VILLA DETAILS */
  villaDetails?: {
    villaType?: "independent" | "row-house" | "duplex" | "triplex";
    plotArea?: number;
    builtUpArea?: number;
    numberOfFloors?: number;
    gardenArea?: number;
    parkingSpaces?: number;
    gatedCommunity?: boolean;
    belconies?: number;
        bedrooms?: number;
    bathrooms?: number;

    specifications?: {
      structure?: string;
      doors?: string;
      windows?: string;
      kitchen?: string;
      bathroom?: string;
      staircase?: string;
      electrical?: string;
    };
  };

  /* COMMERCIAL DETAILS */
  commercialDetails?: {
    propertyUsage?: "office" | "shop" | "showroom" | "coworking";
    carpetArea?: number;
    superBuiltupArea?: number;
    floorNumber?: number;
    parkingAvailable?: boolean;
    ceilingHeight?: number;
    facingRoadWidth?: number;

    specifications?: {
      flooring?: string;
      hvac?: string;
      electrical?: string;
      fireSafety?: string;
      telecom?: string;
    };
  };

  /* OPEN PLOT DETAILS */
  plotDetails?: {
    plotSize?: number;
    plotDimensions?: { length: number; width: number };
    plotType?: "residential" | "commercial" | "industrial" | "agricultural";
    soilType?: string;
    roadWidth?: number;
    cornerPlot?: boolean;
    approvals?: string[];
    layoutNumber?: string;

    amenities?: string[];
    specifications?: {
      roads?: string;
      drainage?: string;
      electricity?: string;
      waterLines?: string;
    };

    layoutMap?: string;
  };

  /* FARM LAND DETAILS */
  farmLandDetails?: {
    totalArea?: number;
    landDimensions?: { length: number; width: number };
    soilType?: string;
    waterSource?: string;
    irrigation?: string;
    plantationType?: string;
    fencing?: string;
    roadWidth?: number;

    amenities?: string[];
    layoutPlan?: string;
    specifications?: {
              waterAvailability: string;
        electricityConnection: string;
        treeCount: string;
        plantationAge: string;
        cropDetails: string;
    }
  };

  /* LOCATION INFO */
  locationDetails?: {
      nearbyLandmarksUrl: string,
      nearbyLandmarks: {
        hospitals: string[],
        schoolCollage: string[],
        itHub: string[],
        roadConnectivity: string[],
      },
  };

  /* MEDIA SECTIONS */
  gallery?: string[];
  constructionStatus?: string[];
  walkthroughImages?: string[];
  walkthroughVideo?: string;
};
// ================== USER (AGENT & SUPER ADMIN) ==================
export interface User {
  _id: string
    id: string
  name: string
  email: string
  phone: string
  password?: string // only used during registration/login
  role: "super_admin" | "agent"
  status: "active" | "inactive" | "suspended"
  avatar?: string
  createdAt: string
  updatedAt: string
  lastLogin?: string

  // for agents
  assignedProperties: string[] // property IDs

  agentInfo?: {
    specialties: string[]
    experience: string
    languages: string[]
    bio: string
    image?: string
  }
}
export interface EnhancedPropertyFormData {
  // Basic info
  success?: boolean
  data?: any
  _id: string
  title: string
  description: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  createdAt?: Property["createdAt"]
  updatedAt?: Property["updatedAt"]
  type: Property["type"]
  status: Property["status"]
  features?: string[]
  featured?: boolean
  developerName?: string
  floorNumber?: number
  totalFloors?: number
  furnished?: "furnished" | "semi-furnished" | "unfurnished" | undefined
  possession?: string
  facing?: string
  reraNumber?: string
  propertySubtype?: string
  pricePerSqft?: number

  // Images
  images?: string[]

  // Agents
  selectedAgentIds?: string[]
  agents?: User[]
  assignedAgents?: string[]

  // Owner
  ownerId?: string

  // Amenities
  amenities?: string[]
  amenitiesStructured?: {
    building?: string[]
    recreational?: string[]
    convenience?: string[]
    connectivity?: string[]
    outdoor?: string[]
    safety?: string[]
  }

  // Apartment-specific
 apartmentDetails?: {
    bhkType?: "" | "2bhk" | "studio" | "1bhk" | "3bhk" | "4bhk" | "5bhk" | "penthouse" | undefined;
    floorPlans?: { id: string; name: string; image: string; area: number; rooms: string[]; }[];
    buildingAmenities?: string[];
    specifications?: {
      flooring?: string;
      kitchen?: string;
      bathroom?: string;
      doors?: string;
      windows?: string;
      electrical?: string;
      safety?: string[];
    };
  };

  // Villa-specific
  villaDetails?: {
    plotArea?: number | undefined
    builtUpArea?: number | undefined
    numberOfFloors?: number | undefined
    gardenArea?: number | undefined
    parkingSpaces?: number | undefined
    villaType?: "" | "independent" | "row-house" | "duplex" | "triplex" | "penthouse" | undefined
    gatedCommunity?: boolean | undefined
  }

  // Plot-specific
  plotDetails?: {
    plotDimensions?: {
      length?: number | undefined
      width?: number | undefined
    }
    soilType?: string | undefined
    roadWidth?: number | undefined
    cornerPlot?: boolean | undefined
    plotType?: "" | "residential" | "commercial" | "industrial" | "agricultural"
    approvals?: string[]
    developmentPotential?: string | undefined
  }

  // Utilities
  utilities?: {
    electricity?: boolean | undefined
    water?: boolean | undefined
    gas?: boolean | undefined
    internet?: boolean | undefined
    cable?: boolean | undefined
  }

  // Financials / Rent info
  maintenanceRequests?: MaintenanceRequest[]
  financialRecords?: FinancialRecord[]
  monthlyRent?: number
  securityDeposit?: number
  leaseTerms?: string

  // Location Details
  locationDetails?: {
    nearbyLandmarks?: {
      name: string
      distance: string
      type: "school" | "hospital" | "mall" | "transport" | "office"
    }[]
    connectivity?: {
      metro?: string[]
      bus?: string[]
      highway?: string[]
    }
  }
}
// ================== BLOG ==================
export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  image: string
  author: string
  category: string
  tags: string[]
  published: boolean
  createdAt: string
  updatedAt: string
}
// ================== CONTACT / LEADS ==================
export interface ContactSubmission {
  _id?: string;
  id: string
  name: string
  email: string
  phone: string
  message: string
  propertyId: string | undefined
  type: "general" | "property-inquiry" | "viewing-request"
  status: "new" | "contacted" | "closed"
  createdAt: string
}
export interface Lead extends ContactSubmission {
  assignedAgents: User[]
  priority: "low" | "medium" | "high"
  source: "website" | "referral" | "social_media" | "advertisement"
  followUpDate?: string
  notes: string[]
  convertedToSale?: boolean
  conversionDate?: string
}
// ================== SITE SETTINGS ==================
export interface SiteSettings {
  id: string
  siteName?: string
  siteDescription?: string
  contactEmail?: string
  contactPhone?: string
  contactPhone2?: string
  mapUrl?: string
  contactBanner?: string
  websiteUrl?: string
  address?: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    instagram?: string
    linkedin?: string
  }
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: string
    aboutTitle?: String,
    aboutText?: String,
    servicesText?: String,
    aboutImage?: String,
    aboutContent?: [{
      title: String,
      description: String,
    }],
    testimonialsPage?: {
      bannerImage?: String,
          testimonials?: [{
      name: String,
      role: String,
      image: String,
      description: String,
    }]
    }
  aboutUsPage?: {
    bannerImage: string
    pageTitle: string
    welcomeImage: string
    welcomeTitle: string
    introText: string
    detailedDescription: string
    visionImage: string
    visionTitle: string
    visionText: string
    visionText2: string
    goalImage: string
    goalTitle: string
    goalText: string
    goalText2: string
    missionImage: string
    missionTitle: string
    missionText: string
    missionText2: string
    statistics: {
      yearsExperience: string
      partnerships: string
      propertiesClosed: string
      happyClients: string
      locations: string
    }
  } | null
}
// ================== AUTH ==================
export interface AuthResponse {
  success: boolean
  user?: Omit<User, "password">
  token?: string
  error?: string
  message?: string
}
export interface LoginCredentials {
  email: string
  password: string
}
export interface RegisterData {
  name: string
  email: string
  phone: string
  password: string
  role: User["role"]
}
// ================== MAINTENANCE ==================
export interface MaintenanceRequest {
  id: string
  tenantId: string
  propertyId: string
  title: string
  description: string
  category: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "other"
  priority: "low" | "medium" | "high" | "emergency"
  status: "pending" | "assigned" | "in_progress" | "completed" | "cancelled"
  assignedTo?: string
  images?: string[]
  estimatedCost?: number
  actualCost?: number
  scheduledDate?: string
  completedDate?: string
  createdAt: string
  updatedAt: string
}
// ================== FINANCIALS ==================
export interface FinancialRecord {
  id: string
  propertyId: string
  tenantId?: string
  type: "rent_payment" | "maintenance_expense" | "utility_bill" | "insurance" | "tax" | "other_income" | "other_expense"
  amount: number
  description: string
  date: string
  status: "pending" | "completed" | "overdue"
  paymentMethod?: "cash" | "check" | "bank_transfer" | "credit_card" | "online"
  receiptUrl?: string
  createdAt: string
  updatedAt: string
}
// ================== PROPERTY MANAGEMENT ==================
export interface PropertyManagement extends Omit<Property, "agentDetails"> {
  ownerId: string // owner userId
  assignedAgents: string[]
  maintenanceRequests: MaintenanceRequest[]
  financialRecords: FinancialRecord[]
  monthlyRent?: number
  securityDeposit?: number
  leaseTerms?: string

  utilities: {
    electricity: boolean
    water: boolean
    gas: boolean
    internet: boolean
    cable: boolean
  }

  amenities: string[]

  // ✅ Instead of rewriting, reuse Property’s definitions
  apartmentDetails: Property["apartmentDetails"]
  villaDetails: Property["villaDetails"]
  plotDetails: Property["plotDetails"]
}


