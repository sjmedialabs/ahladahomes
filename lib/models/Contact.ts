import mongoose, { Schema } from "mongoose"

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "responded"], default: "new" },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property"},
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema)
