import mongoose, { Schema, Model, Document } from "mongoose";

/* =======================
   ENUM
======================= */
export enum UserRole {
  ADMIN = "admin",
  DOCTOR = "doctor",
  PARENT = "parent",
}

/* =======================
   BASE USER
======================= */
export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: UserRole;
  isVerified: boolean;
  otp: string;
  otpExpires: Date | null;
  resetToken?: string;
  resetTokenExpires?: Date | null;
}

const userSchema = new Schema<IUser>(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },

    otpExpires: {
      type: Date,
    },
  },
  {
    timestamps: true,
    discriminatorKey: "role",
  },
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

/* =======================
   DOCTOR
======================= */
export interface IDoctor extends IUser {
  phone: string;
  specialty: string;
  rating: number;
  reviews: number;
  latitude: number;
  longitude: number;
  identityCard: string;
}

const doctorSchema = new Schema<IDoctor>({
  phone: {
    type: String,
    required: true,
  },

  specialty: {
    type: String,
    required: true,
  },

  rating: {
    type: Number,
    default: 0,
  },

  reviews: {
    type: Number,
    default: 0,
  },

  latitude: {
    type: Number,
    required: true,
  },

  longitude: {
    type: Number,
    required: true,
  },

  identityCard: {
    type: String,
    required: true,
  },
});

export const Doctor: Model<IDoctor> =
  (mongoose.models.doctor as Model<IDoctor>) ||
  User.discriminator<IDoctor>("doctor", doctorSchema);

/* =======================
   PARENT
======================= */
export interface IParent extends IUser {
  children: number;
}

const parentSchema = new Schema<IParent>({
  children: {
    type: Number,
    required: true,
    min: 0,
  },
});

export const Parent: Model<IParent> =
  (mongoose.models.parent as Model<IParent>) ||
  User.discriminator<IParent>("parent", parentSchema);
