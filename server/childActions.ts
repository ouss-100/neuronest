"use server";

import connectDB from "@/lib/mongodb";
import { Child, ISymptom } from "@/models/Child";
import mongoose from "mongoose";

/* =======================
   GET CHILDREN BY PARENT
======================= */
export const getChildrenByParent = async (parentId: string) => {
  try {
    await connectDB();
    const children = await Child.find({ parentId }).sort({ createdAt: -1 });
    return { success: true, children: JSON.parse(JSON.stringify(children)) };
  } catch (error) {
    console.error("Error fetching children:", error);
    return { success: false, message: "Failed to fetch children", children: [] };
  }
};

/* =======================
   GET CHILD BY ID
======================= */
export const getChildById = async (childId: string) => {
  try {
    await connectDB();
    const child = await Child.findById(childId);
    if (!child) {
      return { success: false, message: "Child not found" };
    }
    return { success: true, child: JSON.parse(JSON.stringify(child)) };
  } catch (error) {
    console.error("Error fetching child:", error);
    return { success: false, message: "Failed to fetch child" };
  }
};

/* =======================
   ADD CHILD
======================= */
export const addChild = async (data: { parentId: string; age: number; symptoms?: Omit<ISymptom, "createdAt">[] }) => {
  try {
    await connectDB();

    if (!data.parentId || data.age === undefined) {
      return { success: false, message: "Parent ID and age are required" };
    }

    const symptomsWithDate = (data.symptoms || []).map(s => ({
      ...s,
      createdAt: new Date()
    }));

    const newChild = await Child.create({
      parentId: new mongoose.Types.ObjectId(data.parentId),
      age: data.age,
      symptoms: symptomsWithDate,
    });

    return { success: true, message: "Child added successfully", child: JSON.parse(JSON.stringify(newChild)) };
  } catch (error) {
    console.error("Error adding child:", error);
    return { success: false, message: "Failed to add child" };
  }
};

/* =======================
   ADD SYMPTOMS TO CHILD
======================= */
export const addChildSymptoms = async (childId: string, newSymptoms: Omit<ISymptom, "createdAt">[]) => {
  try {
    await connectDB();

    const symptomsWithDate = newSymptoms.map(s => ({
      ...s,
      createdAt: new Date()
    }));

    const updatedChild = await Child.findByIdAndUpdate(
      childId,
      { $push: { symptoms: { $each: symptomsWithDate } } },
      { new: true }
    );

    if (!updatedChild) {
      return { success: false, message: "Child not found" };
    }

    return { success: true, message: "Symptoms added successfully", child: JSON.parse(JSON.stringify(updatedChild)) };
  } catch (error) {
    console.error("Error adding symptoms:", error);
    return { success: false, message: "Failed to add symptoms" };
  }
};
