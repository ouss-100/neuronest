import connectDB from "@/lib/mongodb";
import { Parent } from "@/models/Parent";
import { Doctor } from "@/models/Doctor";
import mongoose from "mongoose";
import { MOCK_PARENT_ID, MOCK_DOCTOR_ID } from "@/lib/constants";

export async function ensureMockUsers() {
  await connectDB();
  
  let parent = await Parent.findById(MOCK_PARENT_ID);
  if (!parent) {
    parent = await Parent.create({
      _id: new mongoose.Types.ObjectId(MOCK_PARENT_ID),
      firstname: "Sarah",
      lastname: "Johnson",
      phone: { countryCode: "+33", number: "600000000" },
      email: "parent@example.com",
      password: "password123",
      role: "PARENT",
      isVerified: true,
      isActive: true,
    });
  }

  let doctor = await Doctor.findById(MOCK_DOCTOR_ID);
  if (!doctor) {
    doctor = await Doctor.create({
      _id: new mongoose.Types.ObjectId(MOCK_DOCTOR_ID),
      firstname: "Dr. Sophie",
      lastname: "Martin",
      phone: { countryCode: "+33", number: "611111111" },
      email: "doctor@example.com",
      password: "password123",
      role: "DOCTOR",
      specialty: "Neurologist",
      latitude: 48.8566,
      longitude: 2.3522,
      identityCard: "123456789",
      isVerified: true,
      isActive: true,
    });
  }
}
