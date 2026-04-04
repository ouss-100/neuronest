import mongoose, { Schema, Document, Model } from "mongoose";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface IAppointment extends Document {
  parentId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  childId: mongoose.Types.ObjectId;

  appointmentDate: Date;
  reason?: string;

  status: AppointmentStatus;

  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
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
    appointmentDate: {
      type: Date,
      required: true,
      index: true,
    },
    reason: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// prevent double booking
AppointmentSchema.index(
  { doctorId: 1, appointmentDate: 1 },
  { unique: true }
);

export const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);