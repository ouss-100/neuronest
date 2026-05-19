"use server";

import connectDB from "@/lib/mongodb";
import { Appointment, AppointmentStatus } from "@/models/Appointment";
import mongoose from "mongoose";

/* =======================
   BOOK APPOINTMENT
======================= */
export const bookAppointment = async (data: {
  parentId: string;
  doctorId: string;
  childId: string;
  appointmentDate: Date;
  reason?: string;
}) => {
  try {
    await connectDB();

    if (!data.parentId || !data.doctorId || !data.childId || !data.appointmentDate) {
      return { success: false, message: "Missing required fields" };
    }

    const newAppointment = await Appointment.create({
      parentId: new mongoose.Types.ObjectId(data.parentId),
      doctorId: new mongoose.Types.ObjectId(data.doctorId),
      childId: new mongoose.Types.ObjectId(data.childId),
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
