/*https://chatgpt.com/c/69bb4fe1-3bc8-832a-bbf4-4bb2d9a4ad09*/


"use server";

import connectDB from "@/lib/mongodb";
import { User, Doctor, Parent } from "@/models/user";
import bcrypt from "bcryptjs";
import { RegisterInput, RegisterResponse } from "@/types/user";
import { serializeUser } from "@/lib/serialize";
import { sendOTPEmail } from "@/lib/mailer";
import { PendingUser } from "@/models/pendingUser";

/* =======================
   GENERATE OTP
======================= */
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* =======================
   REGISTER (SAVE TEMP ONLY)
======================= */
export const registerUser = async (
  data: RegisterInput
): Promise<RegisterResponse> => {
  try {
    await connectDB();

    /* VALIDATION */
    if (!data.firstname || !data.lastname || !data.email || !data.password) {
      return { success: false, message: "All fields are required" };
    }

    /* CHECK EXISTING REAL USER */
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return { success: false, message: "User already exists" };
    }

    /* HASH PASSWORD */
    const hashedPassword = await bcrypt.hash(data.password, 10);

    /* OTP */
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    /* DELETE OLD PENDING USER */
    await PendingUser.deleteOne({ email: data.email });

    /* VALIDATE DOCTOR */
    if (data.role === "doctor") {
      if (
        !data.phone ||
        !data.specialty ||
        !data.latitude ||
        !data.longitude ||
        !data.identityCard
      ) {
        return { success: false, message: "All doctor fields are required" };
      }
    }

    /* SAVE TEMP USER */
    await PendingUser.create({
      ...data,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    /* SEND EMAIL */
    await sendOTPEmail(data.email, otp);

    return {
      success: true,
      message: "OTP sent to your email",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration failed" };
  }
};




/* =======================
   VERIFY OTP + CREATE USER
======================= */
export const verifyOTP = async (email: string, otp: string) => {
  try {
    await connectDB();

    const pending = await PendingUser.findOne({ email });

    if (!pending)
      return { success: false, message: "No pending registration found" };

    if (pending.otp !== otp)
      return { success: false, message: "Invalid OTP" };

    if (pending.otpExpires < new Date())
      return { success: false, message: "OTP expired" };

    let user;

    /* CREATE REAL USER */
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
        children: 0,
        isVerified: true,
      });
    }

    /* DELETE TEMP USER */
    await PendingUser.deleteOne({ email });

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
export const resendOTP = async (email: string) => {
  try {
    await connectDB();

    const pending = await PendingUser.findOne({ email });

    if (!pending)
      return { success: false, message: "No pending user" };

    const otp = generateOTP();

    pending.otp = otp;
    pending.otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await pending.save();

    await sendOTPEmail(email, otp);

    return { success: true, message: "OTP resent" };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};




















/*
"use server";

import connectDB from "@/lib/mongodb";
import { User, Doctor, Parent } from "@/models/user";
import bcrypt from "bcryptjs";
import { RegisterInput, RegisterResponse } from "@/types/user";
import { serializeUser } from "@/lib/serialize";
import { sendOTPEmail } from "@/lib/mailer";

/* =======================
   GENERATE OTP
======================= 
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* =======================
   REGISTER
======================= 
export const registerUser = async (
  data: RegisterInput,
): Promise<RegisterResponse> => {
  try {
    await connectDB();

    /* VALIDATION 
    if (!data.firstname || !data.lastname || !data.email || !data.password) {
      return { success: false, message: "All fields are required" };
    }

    /* CHECK USER 
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return { success: false, message: "Email already exists" };
    }

    /* HASH PASSWORD 
    const hashedPassword = await bcrypt.hash(data.password, 10);

    /* OTP 
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const baseUser = {
      firstname: data.firstname,
      lastname: data.lastname,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      otp,
      otpExpires,
      isVerified: false,
    };

    let user;

    /* DOCTOR 
    if (data.role === "doctor") {
      if (
        !data.phone ||
        !data.specialty ||
        !data.latitude ||
        !data.longitude ||
        !data.identityCard
      ) {
        return { success: false, message: "All doctor fields are required" };
      }

      const identityCardPath = `/uploads/${Date.now()}-${data.identityCard.name}`;

      user = await Doctor.create({
        ...baseUser,
        phone: data.phone,
        specialty: data.specialty,
        latitude: data.latitude,
        longitude: data.longitude,
        identityCard: identityCardPath,
      });
    }

    /* PARENT 
    if (data.role === "parent") {
      user = await Parent.create({
        ...baseUser,
        children: 0,
      });
    }

    /* SEND EMAIL 
    await sendOTPEmail(data.email, otp);

    return {
      success: true,
      message: "OTP sent to your email",
      user: serializeUser(user),
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Registration failed" };
  }
};

/* =======================
   VERIFY OTP
======================= 
export const verifyOTP = async (email: string, otp: string) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) return { success: false, message: "User not found" };

    if (user.otp !== otp) {
      return { success: false, message: "Invalid OTP" };
    }

    if (user.otpExpires && user.otpExpires < new Date()) {
      return { success: false, message: "OTP expired" };
    }

    user.isVerified = true;
    user.otp = "";
    user.otpExpires = null;

    await user.save();

    return { success: true, message: "Email verified successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Verification failed" };
  }
};

/* =======================
   RESEND OTP
======================= 
export const resendOTP = async (email: string) => {
  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) return { success: false };

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 3 * 60 * 1000);

    await user.save();

    await sendOTPEmail(email, otp);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
};*/