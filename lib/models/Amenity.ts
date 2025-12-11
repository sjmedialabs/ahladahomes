import mongoose from "mongoose";

const AmenitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String }, // icon or image
    category: {
      type: String,
      required: true,
      enum: [
        "building",
        "recreational",
        "indoor",
        "outdoor",
        "safety",
        "convenience",
        "connectivity",
        "farming",
        "others"
      ],
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Amenity ||
  mongoose.model("Amenity", AmenitySchema);
