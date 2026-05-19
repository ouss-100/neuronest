"use server";

import connectDB from "@/lib/mongodb";
import { Assessment, IAssessmentStep } from "@/models/Assessment";
import mongoose from "mongoose";

/* =======================
   CREATE ASSESSMENT
======================= */
export const createAssessment = async (data: {
  childId: string;
  symptomsSnapshot: string[];
  steps: IAssessmentStep[];
}) => {
  try {
    await connectDB();

    if (!data.childId || !data.symptomsSnapshot || !data.steps) {
      return { success: false, message: "Missing required fields" };
    }

    const newAssessment = await Assessment.create({
      childId: new mongoose.Types.ObjectId(data.childId),
      symptomsSnapshot: data.symptomsSnapshot,
      steps: data.steps,
    });

    return { 
      success: true, 
      message: "Assessment created successfully", 
      assessment: JSON.parse(JSON.stringify(newAssessment)) 
    };
  } catch (error) {
    console.error("Error creating assessment:", error);
    return { success: false, message: "Failed to create assessment" };
  }
};

/* =======================
   GET ASSESSMENTS BY CHILD
======================= */
export const getAssessmentsByChild = async (childId: string) => {
  try {
    await connectDB();
    const assessments = await Assessment.find({ childId }).sort({ createdAt: -1 });
      
    return { success: true, assessments: JSON.parse(JSON.stringify(assessments)) };
  } catch (error) {
    console.error("Error fetching assessments:", error);
    return { success: false, message: "Failed to fetch assessments", assessments: [] };
  }
};
