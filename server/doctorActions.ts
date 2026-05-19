"use server";

import connectDB from "@/lib/mongodb";
import { Doctor } from "@/models/Doctor";

/* =======================
   GET ALL ACTIVE DOCTORS
======================= */
export const getActiveDoctors = async () => {
  try {
    await connectDB();
    const doctors = await Doctor.find({ isActive: true })
      .select("-password")
      .sort({ firstname: 1 });
      
    return { success: true, doctors: JSON.parse(JSON.stringify(doctors)) };
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return { success: false, message: "Failed to fetch doctors", doctors: [] };
  }
};

/* =======================
   SEARCH DOCTORS BY SPECIALTY
======================= */
export const searchDoctorsBySpecialty = async (specialty: string) => {
  try {
    await connectDB();
    const doctors = await Doctor.find({ 
      isActive: true, 
      specialty: { $regex: new RegExp(specialty, "i") } 
    }).select("-password");
      
    return { success: true, doctors: JSON.parse(JSON.stringify(doctors)) };
  } catch (error) {
    console.error("Error searching doctors:", error);
    return { success: false, message: "Failed to search doctors", doctors: [] };
  }
};
