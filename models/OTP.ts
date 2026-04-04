import mongoose, { Schema, Model, Document } from "mongoose";
import crypto from "crypto";

/* =======================
   INTERFACE
======================= */
export interface IOTP extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiredAt: Date;
  isUsed: boolean;

  compareOTP(otp: string): Promise<boolean>;
}

/* =======================
   SCHEMA
======================= */
const OTPSchema = new Schema<IOTP>(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // auto delete when expired
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

/* =======================
   STATIC: GENERATE OTP
======================= */
OTPSchema.statics.generateOTP = function (): string {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

/* =======================
   MIDDLEWARE: HASH OTP
======================= */
OTPSchema.pre("save", function () {
  if (!this.isModified("token")) return;

  this.token = crypto.createHash("sha256").update(this.token).digest("hex");
});

/* =======================
   METHOD: COMPARE OTP
======================= */
OTPSchema.methods.compareOTP = async function (otp: string) {
  const hash = crypto.createHash("sha256").update(otp).digest("hex");
  return this.token === hash;
};

/* =======================
   MODEL TYPE (IMPORTANT)
======================= */
interface IOTPModel extends Model<IOTP> {
  generateOTP(): string;
}

/* =======================
   EXPORT MODEL
======================= */
export const OTP: IOTPModel =
  (mongoose.models.OTP as IOTPModel) ||
  mongoose.model<IOTP, IOTPModel>("OTP", OTPSchema);
