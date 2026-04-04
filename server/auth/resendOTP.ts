"use server";

import mongoose from "mongoose";
import { OTP } from "@/models/OTP";
import { User } from "@/models/User";
import connectDB from "@/lib/mongodb";
import { sendOTPEmail } from "@/lib/mailer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export const resendOTP = async () => {
  await connectDB();

  const dbSession = await mongoose.startSession();

  try {
    dbSession.startTransaction();

    /* =======================
       GET USER FROM SESSION
    ======================= */
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;

    /* =======================
       GET USER
    ======================= */
    const user = await User.findById(userId).session(dbSession);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.isVerified) {
      throw new Error("User already verified");
    }

    /* =======================
       RATE LIMIT (30s)
    ======================= */
    if (
      user.lastOTPSendAt &&
      Date.now() - new Date(user.lastOTPSendAt).getTime() < 30 * 1000
    ) {
      throw new Error("Please wait before requesting another OTP");
    }

    /* =======================
       DELETE OLD OTPs
    ======================= */
    await OTP.deleteMany({
      userId,
      isUsed: false,
    }).session(dbSession);

    /* =======================
       CREATE NEW OTP
    ======================= */
    const otp = OTP.generateOTP();

    await OTP.create(
      [
        {
          userId,
          token: otp,
          expiredAt: new Date(Date.now() + 3 * 60 * 1000),
        },
      ],
      { session: dbSession },
    );

    /* =======================
       SEND EMAIL
    ======================= */
    await sendOTPEmail(user.email, otp);

    /* =======================
       UPDATE USER
    ======================= */
    user.lastOTPSendAt = new Date();
    user.verificationAttempts += 1;

    await user.save({ session: dbSession });

    await dbSession.commitTransaction();

    console.log("Resent OTP:", otp);

    return {
      success: true,
      message: "OTP resent successfully",
    };
  } catch (error: any) {
    await dbSession.abortTransaction();

    console.error("Resend OTP error:", error.message);

    throw new Error(error.message || "Failed to resend OTP");
  } finally {
    dbSession.endSession();
  }
};
