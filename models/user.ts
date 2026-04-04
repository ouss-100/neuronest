import mongoose, { Schema, Model, Document } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  PARENT = "PARENT",
}

// USER
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  phone: {
    countryCode: string;
    number: string;
  };
  email: string;
  password: string;
  role: UserRole;

  isVerified: boolean;
  lastOTPSendAt: Date;
  verificationAttempts: number;

  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },

    phone: {
      countryCode: { type: String, required: true },
      number: { type: String, required: true },
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["ADMIN", "DOCTOR", "PARENT"],
      required: true,
    },

    isVerified: { type: Boolean, default: false },

    lastOTPSendAt: { type: Date, default: null },

    verificationAttempts: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    discriminatorKey: "userType",
  },
);

/* =======================
   PASSWORD HASHING
======================= */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =======================
   PASSWORD CHECK
======================= */
userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

/* =======================
   EXPORT USER
======================= */
export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
