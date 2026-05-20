import mongoose, { Schema, Document, Model } from "mongoose";


export interface IRapport extends Document {
  doctorId: mongoose.Types.ObjectId;
  childId: mongoose.Types.ObjectId;

  appointmentId?: mongoose.Types.ObjectId;

  title: string;
  description: string;

  diagnosis?: string;
  notes?: string;

  recommendations?: string;
  medications?: string;
  exercises?: string;


  nextVisitDate?: Date;

  isDraft: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const RapportSchema = new Schema<IRapport>(
  {
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
      index: true,
    },
    childId: {
      type: Schema.Types.ObjectId,
      ref: "Child",
      required: true,
      index: true,
    },
    appointmentId: {
      type: Schema.Types.ObjectId,
      ref: "Appointment",
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },

    diagnosis: {
      type: String,
    },
    notes: {
      type: String,
    },

    recommendations: {
      type: String,
    },
    medications: {
      type: String,
    },
    exercises: {
      type: String,
    },

    nextVisitDate: {
      type: Date,
    },

    isDraft: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Rapport: Model<IRapport> =
  mongoose.models.Rapport || mongoose.model<IRapport>("Rapport", RapportSchema);