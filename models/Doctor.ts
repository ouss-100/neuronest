import mongoose, { Schema } from "mongoose";
import { User, IUser } from "./User";

export interface IDoctor extends IUser {
  specialty: string;
  latitude: number;
  longitude: number;
  identityCard: string;
  isActive: boolean;
}

const doctorSchema = new Schema<IDoctor>({
  specialty: { type: String, required: true },

  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },

  identityCard: { type: String, required: true },
});

doctorSchema.pre("save", async function () {
  if (this.isNew) {
    this.isActive = false;
  }
});

/* =======================
   DOCTOR DISCRIMINATOR
======================= */
export const Doctor =
  (mongoose.models.Doctor as mongoose.Model<IDoctor>) ||
  User.discriminator<IDoctor>("Doctor", doctorSchema);