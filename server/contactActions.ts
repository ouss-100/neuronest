"use server";

import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { Types } from "mongoose";
import { Role } from "@/types/contact";

export async function insertContact(data: {
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  message: string;
}) {
  await dbConnect();

  try {
    await Contact.create(data);
    return { success: true };
  } catch (err) {
    console.error("Error inserting contact:", err);
    throw new Error("Failed to save contact message.");
  }
}

export async function deleteContact(id: string) {
  await dbConnect();

  if (!Types.ObjectId.isValid(id)) {
    throw new Error("Invalid contact ID.");
  }

  try {
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) throw new Error("Contact message not found.");
    return deleted;
  } catch (err) {
    console.error("Error deleting contact:", err);
    throw new Error("Failed to delete contact message.");
  }
}

export async function getAllContacts() {
  await dbConnect();
  return Contact.find().sort({ createdAt: -1 });
}
