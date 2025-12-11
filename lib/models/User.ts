import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["super_admin", "agent"],
      default: "agent",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "active",
    },
    // ✅ Keep references to properties
    assignedProperties: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    ],
    agentInfo: {
      specialties: [String],
      experience: String,
      languages: [String],
      bio: String,
      image: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
