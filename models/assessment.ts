import mongoose, { Schema, Document } from "mongoose";

export interface IAssessment extends Document {
  patient: mongoose.Types.ObjectId; // reference to User
  doctor?: mongoose.Types.ObjectId; // optional reference
  date: Date;
  results: {
    disorder: string;
    severity: "mild" | "moderate" | "severe";
    confidence: number; // AI confidence in %
    recommendations: string[]; // Steps the patient should take
  }[];
  notes?: string; // optional doctor notes
}

const AssessmentSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: Schema.Types.ObjectId, ref: "User" },
    date: { type: Date, default: Date.now },
    results: [
      {
        disorder: { type: String, required: true },
        severity: { type: String, enum: ["mild", "moderate", "severe"], required: true },
        confidence: { type: Number, required: true },
        recommendations: [{ type: String }],
      },
    ],
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.models.Assessment || mongoose.model<IAssessment>("Assessment", AssessmentSchema);