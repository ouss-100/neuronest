"use server";

import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import bcrypt from "bcryptjs";

interface ResetPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export const resetPassword = async ({
  email,
  otp,
  newPassword,
}: ResetPasswordInput) => {
  await connectDB();

  try {
    /* =======================
       VALIDATE INPUT
    ======================= */
    if (!email) throw new Error("Email is required");

    if (!otp) throw new Error("OTP is required");

    if (!newPassword || newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }

    /* =======================
       GET USER
    ======================= */
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    /* =======================
       GET OTP RECORDS
    ======================= */
    const otpRecords = await OTP.find({
      userId: user._id,
      isUsed: false,
    });

    if (!otpRecords.length) {
      throw new Error("No OTP found");
    }

    /* =======================
       FIND VALID OTP
    ======================= */
    let validOTP = null;

    for (const record of otpRecords) {
      const isMatch = await record.compareOTP(otp);

      if (isMatch) {
        validOTP = record;
        break;
      }
    }

    if (!validOTP) {
      throw new Error("Invalid OTP");
    }

    /* =======================
       CHECK EXPIRATION
    ======================= */
    if (validOTP.expiredAt < new Date()) {
      throw new Error("OTP expired");
    }

    /* =======================
       HASH PASSWORD
    ======================= */
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    /* =======================
       UPDATE PASSWORD
    ======================= */
    user.password = hashedPassword;

    await user.save();

    /* =======================
       CLEAN OTPs
    ======================= */
    await OTP.deleteMany({ userId: user._id });

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (error: any) {
    console.error("Reset password error:", error.message);

    throw new Error(error.message || "Reset password failed");
  }
};