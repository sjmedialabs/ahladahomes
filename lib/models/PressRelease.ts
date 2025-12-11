import mongoose from "mongoose";

const PressReleaseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true }, // Cover image
    gallery: [{ type: String }], // Additional images if any
    category: { type: String },
    date: { type: Date, default: Date.now },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PressRelease ||
  mongoose.model("PressRelease", PressReleaseSchema);
