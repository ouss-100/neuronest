import mongoose, { Schema, Document } from "mongoose";

export interface IRecommendation extends Document {
  patient: mongoose.Types.ObjectId;
  type: "doctor" | "activity" | "resource";
  content: string; // e.g., "See Dr. Smith in Tunis" or "Practice reading daily"
  isRead: boolean;
}

const RecommendationSchema: Schema = new Schema(
  {
    patient: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["doctor", "activity", "resource"], required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Recommendation || mongoose.model<IRecommendation>(
  "Recommendation",
  RecommendationSchema
);