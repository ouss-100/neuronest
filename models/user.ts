import mongoose, { Schema, Model, Document } from "mongoose";

/* =======================
   ENUM
======================= */
export enum UserRole {
  ADMIN = "admin",
  PATIENT = "patient",
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

/* =======================
   PATIENT (OPTIONAL)
======================= */
export interface IPatient extends IUser {
  age?: number;
  gender?: string;
}

const patientSchema = new Schema<IPatient>({
  age: {
    type: Number,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
});

export const Patient: Model<IPatient> =
  (mongoose.models.patient as Model<IPatient>) ||
  User.discriminator<IPatient>("patient", patientSchema);
