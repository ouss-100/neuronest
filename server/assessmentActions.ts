"use server";

import connectDB from "@/lib/mongodb";
import { Assessment, IAssessmentStep } from "@/models/Assessment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { Child } from "@/models/Child";
import { MOCK_PARENT_ID } from "@/lib/constants";
import { ensureMockUsers } from "@/lib/mockSession";

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

export async function askDeepSeek(prompt: string, maxTokens = 1000) {
  const response = await fetch("https://text.pollinations.ai/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages: [
        { 
          role: "system", 
          content: "You are a developmental screening assistant. Only respond with valid JSON matching the requested structure." 
        },
        { role: "user", content: prompt }
      ],
      jsonMode: true,
      seed: Math.floor(Math.random() * 1000000),
    }),
  });

  if (!response.ok) {
    throw new Error(`AI API failed with status ${response.status}`);
  }

  const text = await response.text();
  return text;
}

export async function analyzeAssessment(qaPairs: { question: string; answer: string }[]) {
  const prompt = `
You are an expert educational psychologist and developmental screening assistant.
A parent has completed a developmental screening questionnaire for their child.
Here are the questions and the parent's answers:

${qaPairs.map((pair, index) => `${index + 1}. Q: ${pair.question}\nA: ${pair.answer}`).join("\n\n")}

Please analyze these responses to identify:
1. Overall developmental score (0 to 100%, where 100% represents no concerns, and lower scores indicate potential areas needing attention/evaluation).
2. Score breakdown by developmental areas. You must analyze and return scores (0-100%) and status ("good" or "attention") for the following EXACT areas:
   - "Reading Comprehension"
   - "Letter Recognition"
   - "Attention Span"
   - "Number Skills"
   - "Writing Skills"
   - "Following Instructions"
3. Actionable recommendations for the parent based on the concerns flagged.

You must respond ONLY with a valid JSON object. Do not include any explanations, introduction, markdown code blocks, or thinking process tags outside of the JSON. The JSON structure must match this template exactly:
{
  "score": 75,
  "analysis": [
    { "area": "Reading Comprehension", "score": 60, "status": "attention" },
    { "area": "Letter Recognition", "score": 85, "status": "good" },
    { "area": "Attention Span", "score": 50, "status": "attention" },
    { "area": "Number Skills", "score": 90, "status": "good" },
    { "area": "Writing Skills", "score": 70, "status": "good" },
    { "area": "Following Instructions", "score": 55, "status": "attention" }
  ],
  "recommendations": [
    "Short description of recommendation 1.",
    "Short description of recommendation 2."
  ]
}
`;

  try {
    const rawResponse = await askDeepSeek(prompt, 1200);
    let text = typeof rawResponse === "string" ? rawResponse : JSON.stringify(rawResponse);
    
    // Strip thinking block if present
    if (text.includes("</think>")) {
      text = text.split("</think>").pop() || text;
    }
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }
    const result = JSON.parse(jsonMatch[0]);
    return { success: true, result };
  } catch (error: any) {
    console.error("Error in analyzeAssessment:", error);
    return { success: false, message: error.message || "Failed to analyze assessment" };
  }
}

export async function saveAssessmentResult(result: { score: number; analysis: any[]; recommendations: string[] }, childInfo?: { age: number, gender: string }) {
  try {
    await connectDB();
    await ensureMockUsers();
    const session = await getServerSession(authOptions);
    const parentId = session?.user?.id || MOCK_PARENT_ID;

    // Find or create child
    let child = await Child.findOne({ parentId });
    if (!child) {
      child = await Child.create({
        parentId,
        age: childInfo?.age || 7,
        gender: childInfo?.gender || "Other",
        symptoms: [],
      });
    } else if (childInfo) {
      child.age = childInfo.age;
      child.gender = childInfo.gender;
      await child.save();
    }

    // Create Assessment in database
    const newAssessment = await Assessment.create({
      childId: child._id,
      score: result.score,
      analysis: result.analysis,
      recommendations: result.recommendations,
      symptomsSnapshot: [],
      steps: [],
    });

    return { success: true, assessment: JSON.parse(JSON.stringify(newAssessment)) };
  } catch (error: any) {
    console.error("Error saving assessment result:", error);
    return { success: false, message: error.message || "Failed to save assessment result" };
  }
}

export async function getParentAssessments() {
  try {
    await connectDB();
    await ensureMockUsers();
    const session = await getServerSession(authOptions);
    const parentId = session?.user?.id || MOCK_PARENT_ID;

    // Find children for this parent
    let children = await Child.find({ parentId });

    // If no children exist, create a default one
    if (children.length === 0) {
      const defaultChild = await Child.create({
        parentId,
        age: 7,
        gender: "Other",
        symptoms: [],
      });
      children = [defaultChild];
    }

    const childIds = children.map(c => c._id);

    // Find all assessments for these children
    const assessments = await Assessment.find({ childId: { $in: childIds } }).sort({ createdAt: -1 });

    return { success: true, assessments: JSON.parse(JSON.stringify(assessments)) };
  } catch (error: any) {
    console.error("Error fetching parent assessments:", error);
    return { success: false, message: error.message || "Failed to fetch assessments" };
  }
}