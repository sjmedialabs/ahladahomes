import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    /* ========= BASIC INFORMATION ========= */
    title: { type: String, required: true },
    subtitle: { type: String },
    description: { type: String, required: true },

    price: { type: Number, required: true },
    pricePerSqft: { type: Number },

    location: { type: String, required: true },
    city: { type: String },
    area: { type: Number, required: true },

    type: {
      type: String,
      required: true,
      enum: ["apartment", "villa", "commercial", "open-plot", "farm-land"],
    },

    status: {
      type: String,
      required: true,
      enum: ["for-sale", "for-rent", "sold", "rented"],
    },

    images: [{ type: String }],
    videos: [
      {
        videoUrl: { type: String, required: true },
        thumbnailUrl: { type: String, required: true },
      },
    ],
    broucher:{
    brochureLink: { type: String },
    brochureThumbnail1: { type: String },
    brochureThumbnail2: { type: String },
    brochureThumbnail3: { type: String },
    },
    facing: { type: String },
    totalFloors: { type: Number },
    furnished: {
      type: String,
      enum: ["unfurnished", "semi-furnished", "furnished"],
    },
    possession: { type: String },
    reraNumber: { type: String },
    developerName: { type: String },
    featured: { type: Boolean, default: false },

    /* ========= HIGHLIGHTS ========= */
    highlights: [{ type: String }],

    /* ========= NEW AMENITIES SYSTEM ========= */
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],

    /* ========= FLOOR PLAN SYSTEM ========= */
    supportsFloorPlans: { type: Boolean, default: false },

    hasTowers: { type: Boolean, default: false },

    towers: [
      {
        name: { type: String }, // Tower A
        floors: { type: Number },
        units: { type: Number },
        floorPlans: [{ type: String }],
        facing: { type: String },
      },
    ],

    floorPlans: [{ type: String }], // If no towers
    masterPlan: { type: String },
    locationMap: { type: String },
    /* ========= APARTMENT DETAILS ========= */
    apartmentDetails: {
      bhkType: {
        type: String,
        enum: ["studio", "1bhk", "2bhk", "3bhk", "4bhk", "5+bhk", "penthouse"],
      },
      bedrooms: { type: Number },
      bathrooms: { type: Number },
      balconies: { type: Number },
      towers: { type: Number },
      floorsPerTower: { type: Number },
      totalUnits: { type: Number },
      possessionDate: { type: String },

      specifications: {
        doors: String,
        windows: String,
        flooring: String,
        kitchen: String,
        bathroom: String,
        electrical: String,
        walls: String,
      },
    },

    /* ========= VILLA DETAILS ========= */
    villaDetails: {
      villaType: {
        type: String,
        enum: ["independent", "row-house", "duplex", "triplex"],
      },
      plotArea: Number,
      builtUpArea: Number,
      numberOfFloors: Number,
      gardenArea: Number,
      parkingSpaces: Number,
      gatedCommunity: Boolean,
      belconies: Number,
      bedrooms: { type: Number },
      bathrooms: { type: Number },

      specifications: {
        structure: String,
        doors: String,
        windows: String,
        kitchen: String,
        bathroom: String,
        staircase: String,
        electrical: String,
      },
    },

    /* ========= COMMERCIAL ========= */
    commercialDetails: {
      propertyUsage: {
        type: String,
        enum: ["office", "shop", "showroom", "coworking"],
      },
      carpetArea: Number,
      superBuiltupArea: Number,
      floorNumber: Number,
      parkingAvailable: Boolean,
      ceilingHeight: Number,
      facingRoadWidth: Number,

      specifications: {
        flooring: String,
        hvac: String,
        electrical: String,
        fireSafety: String,
        telecom: String,
      },
    },

    /* ========= OPEN PLOT ========= */
    plotDetails: {
      plotSize: Number,
      plotDimensions: {
        length: Number,
        width: Number,
      },
      plotType: {
        type: String,
        enum: ["residential", "commercial", "industrial", "agricultural"],
      },
      soilType: String,
      roadWidth: Number,
      cornerPlot: Boolean,
      approvals: [String],
      layoutNumber: String,
      specifications: {
        roads: String,
        drainage: String,
        electricity: String,
        waterLines: String
      }
    },

    /* ========= FARM LAND ========= */
    farmLandDetails: {
      totalArea: Number,
      landDimensions: {
        length: Number,
        width: Number,
      },
      soilType: String,
      waterSource: String,
      irrigation: String,
      plantationType: String,
      fencing: String,
      roadWidth: Number,
      specifications: {
        waterAvailability: String,
        electricityConnection: String,
        treeCount: String,
        plantationAge: String,
        cropDetails: String,
      }
    },

    /* ========= LOCATION ========== */
locationDetails: {
  nearbyLandmarksUrl: { type: String },
  nearbyLandmarks: {
    hospitals: { type: [String], default: [] },
    schoolCollage: { type: [String], default: [] },
    itHub: { type: [String], default: [] },
    roadConnectivity: { type: [String], default: [] },
  }
},

    /* ========= MEDIA ========= */
    gallery: [String],
    constructionStatus: [String],
    walkthroughImages: [String],
    walkthroughVideo: String,
  },

  { timestamps: true }
);

export default mongoose.models?.Property ??
  mongoose.model("Property", PropertySchema);

