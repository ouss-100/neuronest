"use server";

import mongoose from "mongoose";
import { User } from "@/models/User";
import { Doctor } from "@/models/Doctor";
import { Parent } from "@/models/Parent";
import { OTP } from "@/models/OTP";
import { RegisterInput } from "@/types/RegisterInput";
import connectDB from "@/lib/mongodb";
import { sendOTPEmail } from "@/lib/mailer";

export const registerUser = async (data: RegisterInput) => {
  await connectDB();

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({
      email: data.email,
    }).session(session);

    /* =======================
       USER EXISTS + VERIFIED
    ======================= */
    if (existingUser && existingUser.isVerified) {
      await session.abortTransaction();
      return { success: false, message: "User already exists" };
    }

    /* =======================
       USER EXISTS + NOT VERIFIED
    ======================= */
    if (existingUser && !existingUser.isVerified) {
      const otp = OTP.generateOTP();

      await OTP.deleteMany({
        userId: existingUser._id,
        isUsed: false,
      }).session(session);

      await OTP.create(
        [
          {
            userId: existingUser._id,
            token: otp,
            expiredAt: new Date(Date.now() + 3 * 60 * 1000),
          },
        ],
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      // ✅ send email OUTSIDE transaction
      await sendOTPEmail(existingUser.email, otp);

      return {
        success: true,
        message: "OTP resent",
        userId: existingUser._id.toString(),
      };
    }

    /* =======================
       CREATE NEW USER
    ======================= */
    let newUser;

    if (data.role === "DOCTOR") {
      if (
        !data.specialty ||
        data.latitude === undefined ||
        data.longitude === undefined ||
        !data.identityCard
      ) {
        throw new Error("Missing doctor fields");
      }

      [newUser] = await Doctor.create(
        [
          {
            ...data,
            role: "DOCTOR",
            isVerified: false,
            lastOTPSendAt: new Date(),
          },
        ],
        { session }
      );
    } else {
      [newUser] = await Parent.create(
        [
          {
            ...data,
            role: "PARENT",
            isVerified: false,
            lastOTPSendAt: new Date(),
          },
        ],
        { session }
      );
    }

    /* =======================
       CREATE OTP
    ======================= */
    const otp = OTP.generateOTP();

    await OTP.create(
      [
        {
          userId: newUser._id,
          token: otp,
          expiredAt: new Date(Date.now() + 3 * 60 * 1000),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    // ✅ send email AFTER commit
    await sendOTPEmail(newUser.email, otp);

    return {
      success: true,
      message: "User registered. OTP sent.",
      userId: newUser._id.toString(),
    };
  } catch (error: any) {
    await session.abortTransaction();
    session.endSession();

    console.error("Register error:", error.message);

    return {
      success: false,
      message: error.message || "Something went wrong",
    };
  }
};