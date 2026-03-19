"use server";

import connectDB from "@/lib/mongodb";
import { User, Doctor, Parent } from "@/models/user";
import bcrypt from "bcryptjs";
import { RegisterInput, RegisterResponse } from "@/types/user";
import { serializeUser } from "@/lib/serialize";

/* =======================
   REGISTER USER
======================= */
export const registerUser = async (
  data: RegisterInput,
): Promise<RegisterResponse> => {
  try {
    await connectDB();

    /* =======================
       VALIDATION (COMMON)
    ======================= */
    if (
      !data.firstname ||
      !data.lastname ||
      !data.email ||
      !data.password ||
      !data.role
    ) {
      return {
        success: false,
        message: "All fields are required",
      };
    }

    /* =======================
       EMAIL FORMAT
    ======================= */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: "Invalid email format",
      };
    }

    /* =======================
       PASSWORD LENGTH
    ======================= */
    if (data.password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    /* =======================
       CHECK EXISTING USER
    ======================= */
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    /* =======================
       HASH PASSWORD
    ======================= */
    const hashedPassword = await bcrypt.hash(data.password, 10);

    /* =======================
       BASE USER
    ======================= */
    const baseUser = {
      firstname: data.firstname.trim(),
      lastname: data.lastname.trim(),
      email: data.email.toLowerCase().trim(),
      password: hashedPassword,
      role: data.role,
    };

    /* =======================
       DOCTOR VALIDATION
    ======================= */
    if (data.role === "doctor") {
      if (
        !data.phone ||
        !data.specialty ||
        !data.latitude ||
        !data.longitude ||
        !data.identityCard
      ) {
        return {
          success: false,
          message: "All doctor fields are required",
        };
      }

      /* =======================
         FILE (TEMPORARY)
      ======================= */
      const identityCardPath = `/uploads/${Date.now()}-${data.identityCard.name}`;

      const doctor = await Doctor.create({
        ...baseUser,
        phone: data.phone.trim(),
        specialty: data.specialty.trim(),
        latitude: data.latitude,
        longitude: data.longitude,
        identityCard: identityCardPath,
      });

      return {
        success: true,
        user: serializeUser(doctor),
      };
    }

    /* =======================
       PARENT VALIDATION
    ======================= */
    if (data.role === "parent") {
      const parent = await Parent.create({
        ...baseUser,
        children: 0,
      });

      return {
        success: true,
        user: serializeUser(parent),
      };
    }

    return {
      success: false,
      message: "Invalid role",
    };
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    return {
      success: false,
      message: "Server error, please try again",
    };
  }
};
