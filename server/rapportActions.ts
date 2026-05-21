"use server";

import connectDB from "@/lib/mongodb";
import { Rapport } from "@/models/Rapport";
import mongoose from "mongoose";
import "@/models/Child"; // Ensure Child schema is registered for populate
import "@/models/Doctor"; // Ensure Doctor schema is registered
import "@/models/User"; // Ensure User schema is registered
import "@/models/Appointment"; // Ensure Appointment schema is registered

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
      isDraft: false, // Finalized reports are immediately visible to parents
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
   CREATE DRAFT RAPPORT
======================= */
export const createDraftRapport = async (data: {
  doctorId: string;
  childId: string;
  appointmentId: string;
  description: string;
}) => {
  try {
    await connectDB();

    if (!data.doctorId || !data.childId || !data.appointmentId || !data.description) {
      return { success: false, message: "Missing required fields for draft" };
    }

    const newDraft = await Rapport.create({
      doctorId: new mongoose.Types.ObjectId(data.doctorId),
      childId: new mongoose.Types.ObjectId(data.childId),
      appointmentId: new mongoose.Types.ObjectId(data.appointmentId),
      title: "Assessment Report (Draft)",
      description: data.description,
      isDraft: true,
    });

    return { 
      success: true, 
      message: "Draft rapport created", 
      rapport: JSON.parse(JSON.stringify(newDraft)) 
    };
  } catch (error) {
    console.error("Error creating draft rapport:", error);
    return { success: false, message: "Failed to create draft rapport" };
  }
};

/* =======================
   UPDATE RAPPORT
======================= */
export const updateRapport = async (
  rapportId: string,
  data: Partial<typeof Rapport.prototype>
) => {
  try {
    await connectDB();

    // Prevent overwriting references by accident, but allow completing the rest
    const { doctorId, childId, appointmentId, ...updateFields } = data as any;
    
    if (updateFields.nextVisitDate) {
      updateFields.nextVisitDate = new Date(updateFields.nextVisitDate);
    }

    const updatedRapport = await Rapport.findByIdAndUpdate(
      rapportId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedRapport) {
      return { success: false, message: "Rapport not found" };
    }

    return { 
      success: true, 
      message: "Rapport updated successfully", 
      rapport: JSON.parse(JSON.stringify(updatedRapport)) 
    };
  } catch (error) {
    console.error("Error updating rapport:", error);
    return { success: false, message: "Failed to update rapport" };
  }
};


/* =======================
   GET RAPPORTS BY CHILD
======================= */
export const getRapportsByChild = async (childId: string) => {
  try {
    await connectDB();
    const rapports = await Rapport.find({ childId, isDraft: { $ne: true } })
      .populate("doctorId", "firstname lastname specialty")
      .sort({ createdAt: -1 });
      console.log("rapports parent part",rapports);
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
      .populate("appointmentId", "appointmentDate")
      .sort({ createdAt: -1 });
      
    return { success: true, rapports: JSON.parse(JSON.stringify(rapports)) };
  } catch (error) {
    console.error("Error fetching doctor rapports:", error);
    return { success: false, message: "Failed to fetch rapports", rapports: [] };
  }
};

/* =======================
   GET RAPPORT BY ID
======================= */
export const getRapportById = async (rapportId: string) => {
  try {
    await connectDB();
    
    // Fetch rapport with child, parent, and doctor info
    const rapport = await Rapport.findById(rapportId)
      .populate({
        path: "childId",
        select: "age symptoms parentId",
        populate: {
          path: "parentId",
          select: "firstname lastname email phone",
        }
      })
      .populate("doctorId", "firstname lastname specialty")
      .lean();

    if (!rapport) {
      return { success: false, message: "Report not found" };
    }

    // Fetch the latest assessment for this child
    const { Assessment } = await import("@/models/Assessment");
    const latestAssessment = await Assessment.findOne({ childId: (rapport.childId as any)._id })
      .sort({ createdAt: -1 })
      .lean();

    return { 
      success: true, 
      rapport: JSON.parse(JSON.stringify(rapport)),
      assessment: latestAssessment ? JSON.parse(JSON.stringify(latestAssessment)) : null
    };
  } catch (error) {
    console.error("Error fetching rapport details:", error);
    return { success: false, message: "Failed to fetch report details", rapport: null, assessment: null };
  }
};
