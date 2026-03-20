"use server";

import connectDB from "@/lib/mongodb";
import { User } from "@/models/user";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { sendResetEmail } from "@/lib/mailer";

/* =======================
   REQUEST RESET
======================= */
export const requestPasswordReset = async (email: string) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendResetEmail(email, token);

    return { success: true, message: "Reset link sent to email" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Something went wrong" };
  }
};

/* =======================
   RESET PASSWORD
======================= */
export const resetPassword = async (token: string, password: string) => {
  try {
    await connectDB();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
      return { success: false, message: "Invalid or expired token" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = "";
    user.resetTokenExpires = null;

    await user.save();

    return { success: true, message: "Password reset successful" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Reset failed" };
  }
};
