"use server";

import { OTP } from "@/models/OTP";
import { User } from "@/models/User";
import Notification from "@/models/Notification";
import connectDB from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

interface VerifyOTPInput {
  otp: string;
  userId: string;
}

export const verifyOTP = async ({ otp, userId }: VerifyOTPInput) => {
  await connectDB();

  try {
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const cleanOtp = otp.trim();

    /* =======================
       GET ALL OTPs FOR USER
    ======================= */
    const otpRecords = await OTP.find({
      userId,
      isUsed: false,
    });

    if (!otpRecords.length) {
      throw new Error("No OTP found");
    }

    /* =======================
       FIND MATCH USING HASH COMPARE
    ======================= */
    let validOTP = null;

    for (const record of otpRecords) {
      const isMatch = await record.compareOTP(cleanOtp);

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
       CLEAN ALL OTPs
    ======================= */
    await OTP.deleteMany({ userId });

    /* =======================
       VERIFY USER
    ======================= */
    const user = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { returnDocument: "after" }
    );

    if (user && user.role === "DOCTOR") {
      await Notification.create({
        type: "user",
        title: "New User Registration",
        message: `Dr. ${user.firstname} ${user.lastname} has registered as a doctor and is awaiting approval.`,
        read: false,
      });
    }

    return {
      success: true,
      message: "Account verified successfully",
    };
  } catch (error: any) {
    console.error("Verify OTP error:", error.message);
    throw new Error(error.message || "OTP verification failed");
  }
};