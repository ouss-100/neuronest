"use server";

import connectDB from "@/lib/mongodb";
import { User, Doctor, Parent } from "@/models/User";
import bcrypt from "bcryptjs";
import { RegisterInput, RegisterResponse } from "@/types/user";
import { serializeUser } from "@/lib/serialize";
import { sendOTPEmail, sendResetEmail } from "@/lib/mailer";
import crypto from "crypto";

/* =======================
   GENERATE OTP
======================= */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* =======================
   REGISTER
======================= */
export const registerUser = async (
  data: RegisterInput,
): Promise<RegisterResponse> => {
  try {
    await connectDB();

    if (!data.firstname || !data.lastname || !data.email || !data.password) {
      return { success: false, message: "All fields are required" };
    }

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const verifyToken = crypto.randomUUID();

    await PendingUser.deleteOne({ email: data.email });

    await PendingUser.create({
      ...data,
      password: hashedPassword,
      otp,
      otpExpires,
      verifyToken,
    });

    /* ✅ send OTP + token */
    await sendOTPEmail(data.email, otp, verifyToken);

    return {
      success: true,
      message: "OTP sent to your email",
      verifyToken, // ✅ important
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration failed" };
  }
};

/* =======================
   VERIFY OTP
======================= */
export const verifyOTP = async (otp: string, token: string) => {
  try {
    await connectDB();

    if (!token) {
      return { success: false, message: "No token provided" };
    }

    console.log("TOKEN FROM CLIENT:", token);

    const pending = await PendingUser.findOne({ verifyToken: token });

    console.log("PENDING USER:", pending);

    if (!pending) {
      return { success: false, message: "Invalid session" };
    }

    if (pending.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    if (pending.otpExpires < new Date()) {
      return { success: false, message: "OTP expired" };
    }

    let user;

    if (pending.role === "doctor") {
      user = await Doctor.create({
        firstname: pending.firstname,
        lastname: pending.lastname,
        email: pending.email,
        password: pending.password,
        role: "doctor",
        phone: pending.phone,
        specialty: pending.specialty,
        latitude: pending.latitude,
        longitude: pending.longitude,
        identityCard: pending.identityCard,
        isVerified: true,
      });
    }

    if (pending.role === "parent") {
      user = await Parent.create({
        firstname: pending.firstname,
        lastname: pending.lastname,
        email: pending.email,
        password: pending.password,
        role: "parent",
        isVerified: true,
      });
    }

    await PendingUser.deleteOne({ verifyToken: token });

    return {
      success: true,
      message: "Account created successfully",
      user: serializeUser(user),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Verification failed" };
  }
};

/* =======================
   RESEND OTP
======================= */
export const resendOTP = async (token: string) => {
  try {
    await connectDB();

    const pending = await PendingUser.findOne({ verifyToken: token });

    if (!pending) {
      return { success: false, message: "Invalid session" };
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    pending.otp = otp;
    pending.otpExpires = otpExpires;
    await pending.save();

    await sendOTPEmail(pending.email, otp, token);

    return { success: true, message: "OTP resent" };
  } catch (error) {
    return { success: false, message: "Failed to resend OTP" };
  }
};

export async function forgotPassword(email: string) {
  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return { error: "User not found" };
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  await user.save();

  await sendResetEmail(email, token);

  return { success: true };
}

export async function resetPassword(token: string, password: string) {
  await connectDB();

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });

  if (!user) {
    return { error: "Invalid or expired token" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return { success: true };
}
