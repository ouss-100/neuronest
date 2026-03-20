import mongoose, { Schema, Document } from "mongoose";

export interface IPendingUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "doctor" | "parent";

  phone?: string;
  specialty?: string;
  latitude?: number;
  longitude?: number;
  identityCard?: string;

  otp: string;
  otpExpires: Date;
}

const PendingUserSchema = new Schema<IPendingUser>(
  {
    firstname: String,
    lastname: String,
    email: { type: String, unique: true },
    password: String,
    role: String,

    phone: String,
    specialty: String,
    latitude: Number,
    longitude: Number,
    identityCard: String,

    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

export const PendingUser =
  mongoose.models.PendingUser ||
  mongoose.model<IPendingUser>("PendingUser", PendingUserSchema);