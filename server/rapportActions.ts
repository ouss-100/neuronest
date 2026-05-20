"use server";

import connectDB from "@/lib/mongodb";
import { Rapport } from "@/models/Rapport";
import mongoose from "mongoose";

/* =======================
   CREATE RAPPORT
======================= */
export const createRapport = async (data: {
  doctorId: string;
  childId: string;
  title: string;
  description: string;
  diagnosis: string;
  notes?: string;
  recommendations: string;
  medications?: string;
  exercises?: string;
  nextVisitDate?: Date;
}) => {
  try {
    await connectDB();

    if (!data.doctorId || !data.childId || !data.title || !data.description || !data.diagnosis || !data.recommendations) {
      return { success: false, message: "Missing required fields" };
    }

    const { doctorId, childId, nextVisitDate, ...rest } = data;
    const newRapport = await Rapport.create({
      doctorId: new mongoose.Types.ObjectId(doctorId),
      childId: new mongoose.Types.ObjectId(childId),
      ...rest,
      nextVisitDate: nextVisitDate ? new Date(nextVisitDate) : undefined,
    });

    return { 
      success: true, 
      message: "Rapport created successfully", 
      rapport: JSON.parse(JSON.stringify(newRapport)) 
    };
  } catch (error) {
    console.error("Error creating rapport:", error);
    return { success: false, message: "Failed to create rapport" };
  }
};

/* =======================
   GET RAPPORTS BY CHILD
======================= */
export const getRapportsByChild = async (childId: string) => {
  try {
    await connectDB();
    const rapports = await Rapport.find({ childId })
      .populate("doctorId", "firstname lastname specialty")
      .sort({ createdAt: -1 });
      
    return { success: true, rapports: JSON.parse(JSON.stringify(rapports)) };
  } catch (error) {
    console.error("Error fetching rapports:", error);
    return { success: false, message: "Failed to fetch rapports", rapports: [] };
  }
};

/* =======================
   GET RAPPORTS BY DOCTOR
======================= */
export const getRapportsByDoctor = async (doctorId: string) => {
  try {
    await connectDB();
    const rapports = await Rapport.find({ doctorId })
      .populate("childId", "age symptoms")
      .sort({ createdAt: -1 });
      
    return { success: true, rapports: JSON.parse(JSON.stringify(rapports)) };
  } catch (error) {
    console.error("Error fetching doctor rapports:", error);
    return { success: false, message: "Failed to fetch rapports", rapports: [] };
  }
};
