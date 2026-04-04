"use server";

import connectDB from "@/lib/mongodb";
import { User } from "@/models/User";
import { OTP } from "@/models/OTP";
import { sendResetEmail } from "@/lib/mailer";

export const forgotPassword = async (email: string) => {
  await connectDB();

  try {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    /* =======================
       DELETE OLD OTPs
    ======================= */
    await OTP.deleteMany({
      userId: user._id,
      isUsed: false,
    });

    /* =======================
       CREATE OTP
    ======================= */
    const otp = OTP.generateOTP();

    await OTP.create({
      userId: user._id,
      token: otp,
      expiredAt: new Date(Date.now() + 3 * 60 * 1000),
    });

    /* =======================
       SEND EMAIL
    ======================= */
    await sendResetEmail(user.email, user._id.toString());

    console.log("Reset OTP:", otp);

    return {
      success: true,
      message: "Reset email sent",
    };
  } catch (error: any) {
    console.error("Forgot password error:", error.message);
    throw new Error(error.message || "Failed to send reset email");
  }
};