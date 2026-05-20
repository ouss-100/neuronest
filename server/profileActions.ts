"use server";

import connectDB from "@/lib/mongodb";
import { Parent } from "@/models/Parent";
import { Doctor } from "@/models/Doctor";
import mongoose from "mongoose";

/* =======================
   PARENT PROFILE
======================= */
export const getParentProfile = async (parentId: string) => {
  try {
    await connectDB();
    const parent = await Parent.findById(parentId).select("-password").lean();
    if (!parent) return { success: false, message: "Parent not found" };
    return { success: true, parent: JSON.parse(JSON.stringify(parent)) };
  } catch (error: any) {
    console.error("Error fetching parent profile:", error);
    return { success: false, message: error.message };
  }
};

export const updateParentProfile = async (parentId: string, data: any) => {
  try {
    await connectDB();
    const updated = await Parent.findByIdAndUpdate(parentId, { $set: data }, { new: true }).select("-password").lean();
    if (!updated) return { success: false, message: "Parent not found" };
    return { success: true, parent: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating parent profile:", error);
    return { success: false, message: error.message };
  }
};

/* =======================
   DOCTOR PROFILE
======================= */
export const getDoctorProfile = async (doctorId: string) => {
  try {
    await connectDB();
    const doctor = await Doctor.findById(doctorId).select("-password").lean();
    if (!doctor) return { success: false, message: "Doctor not found" };
    return { success: true, doctor: JSON.parse(JSON.stringify(doctor)) };
  } catch (error: any) {
    console.error("Error fetching doctor profile:", error);
    return { success: false, message: error.message };
  }
};

export const updateDoctorProfile = async (doctorId: string, data: any) => {
  try {
    await connectDB();
    const updated = await Doctor.findByIdAndUpdate(doctorId, { $set: data }, { new: true }).select("-password").lean();
    if (!updated) return { success: false, message: "Doctor not found" };
    return { success: true, doctor: JSON.parse(JSON.stringify(updated)) };
  } catch (error: any) {
    console.error("Error updating doctor profile:", error);
    return { success: false, message: error.message };
  }
};
