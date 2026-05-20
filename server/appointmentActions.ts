"use server";

import connectDB from "@/lib/mongodb";
import { Appointment, AppointmentStatus } from "@/models/Appointment";
import { createDraftRapport } from "./rapportActions";
import mongoose from "mongoose";
import "@/models/Child"; // Ensure Child schema is registered for populate
import "@/models/Doctor"; // Ensure Doctor schema is registered
import "@/models/User"; // Ensure User schema is registered

/* =======================
   BOOK APPOINTMENT
======================= */
export const bookAppointment = async (data: {
  parentId: string;
  doctorId: string;
  childId?: string;
  appointmentDate: Date;
  reason?: string;
}) => {
  try {
    await connectDB();

    if (!data.parentId || !data.doctorId || !data.appointmentDate) {
      return { success: false, message: "Missing required fields" };
    }

    let actualChildId = data.childId;
    if (!actualChildId) {
      // Find the first child of the parent
      const { Child } = await import("@/models/Child");
      const child = await Child.findOne({ parentId: data.parentId });
      if (!child) return { success: false, message: "No child found for this parent" };
      actualChildId = child._id.toString();
    }

    const newAppointment = await Appointment.create({
      parentId: new mongoose.Types.ObjectId(data.parentId),
      doctorId: new mongoose.Types.ObjectId(data.doctorId),
      childId: new mongoose.Types.ObjectId(actualChildId),
      appointmentDate: new Date(data.appointmentDate),
      reason: data.reason,
      status: "pending",
    });

    return { 
      success: true, 
      message: "Appointment booked successfully", 
      appointment: JSON.parse(JSON.stringify(newAppointment)) 
    };
  } catch (error: any) {
    console.error("Error booking appointment:", error);
    if (error.code === 11000) {
      return { success: false, message: "Doctor is already booked at this time" };
    }
    return { success: false, message: "Failed to book appointment" };
  }
};

/* =======================
   GET APPOINTMENTS BY PARENT
======================= */
export const getAppointmentsByParent = async (parentId: string) => {
  try {
    await connectDB();
    const appointments = await Appointment.find({ parentId })
      .populate("doctorId", "firstname lastname specialty latitude longitude")
      .populate("childId", "age symptoms")
      .sort({ appointmentDate: 1 });
      
    return { success: true, appointments: JSON.parse(JSON.stringify(appointments)) };
  } catch (error) {
    console.error("Error fetching parent appointments:", error);
    return { success: false, message: "Failed to fetch appointments", appointments: [] };
  }
};

/* =======================
   GET APPOINTMENTS BY DOCTOR
======================= */
export const getAppointmentsByDoctor = async (doctorId: string) => {
  try {
    await connectDB();
    const appointments = await Appointment.find({ doctorId })
      .populate("parentId", "firstname lastname phone")
      .populate("childId", "age symptoms")
      .sort({ appointmentDate: 1 });
      
    return { success: true, appointments: JSON.parse(JSON.stringify(appointments)) };
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    return { success: false, message: "Failed to fetch appointments", appointments: [] };
  }
};

/* =======================
   UPDATE APPOINTMENT STATUS
======================= */
export const updateAppointmentStatus = async (
  appointmentId: string, 
  status: AppointmentStatus
) => {
  try {
    await connectDB();

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return { success: false, message: "Appointment not found" };
    }

    if (status === "confirmed") {
      // Create a draft rapport
      // Fetch the child's symptoms to pre-fill the description
      const { Child } = await import("@/models/Child");
      const child = await Child.findById(updatedAppointment.childId);
      
      let description = "Patient assessment.";
      if (child && child.symptoms && child.symptoms.length > 0) {
        const symptomsList = child.symptoms.map((s: any) => `- ${s.name}: ${s.description || "No details"}`).join("\n");
        description = `Patient presented with the following symptoms:\n${symptomsList}`;
      }

      await createDraftRapport({
        doctorId: updatedAppointment.doctorId.toString(),
        childId: updatedAppointment.childId.toString(),
        appointmentId: updatedAppointment._id.toString(),
        description,
      });
    }

    return { 
      success: true, 
      message: `Appointment marked as ${status}`, 
      appointment: JSON.parse(JSON.stringify(updatedAppointment)) 
    };
  } catch (error) {
    console.error("Error updating appointment:", error);
    return { success: false, message: "Failed to update appointment" };
  }
};
