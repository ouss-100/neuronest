import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  email: string;
  role: "Parent" | "Healthcare professional" | "Educator" | "Other";
  message: string;
  createdAt: Date;
}

const ContactSchema: Schema<IContact> = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  role: { 
    type: String, 
    enum: ["Parent", "Healthcare professional", "Educator", "Other"], 
    required: true 
  },
  message: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const Contact: Model<IContact> = mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
export default Contact;