import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAssessmentStep {
  title: string;
  description: string;
  order: number;
}

export interface IAssessment extends Document {
  childId: mongoose.Types.ObjectId;

  symptomsSnapshot: string[];

  steps: IAssessmentStep[];


  createdAt: Date;
  updatedAt: Date;
}

const StepSchema = new Schema<IAssessmentStep>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    childId: {
      type: Schema.Types.ObjectId,
      ref: "Child",
      required: true,
      index: true,
    },
    symptomsSnapshot: {
      type: [String],
      required: true,
    },
    steps: [StepSchema],
  },
  { timestamps: true }
);

export const Assessment: Model<IAssessment> =
  mongoose.models.Assessment ||
  mongoose.model<IAssessment>("Assessment", AssessmentSchema);