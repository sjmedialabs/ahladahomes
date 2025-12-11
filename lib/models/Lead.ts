import mongoose, { Schema, Document } from "mongoose";

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source: string;
  status: "new" | "contacted" | "closed";
  priority: "low" | "medium" | "high";
  propertyId?: mongoose.Types.ObjectId;
  notes: string[];
  followUpDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String },
    source: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "closed"], default: "new" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: false },
    notes: [{ type: String }],
    followUpDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);
