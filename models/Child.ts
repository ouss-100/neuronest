import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISymptom {
  name: string;
  description?: string;
  createdAt: Date;
}

export interface IChild extends Document {
  parentId: mongoose.Types.ObjectId;

  age: number;

  symptoms: ISymptom[];

  createdAt: Date;
  updatedAt: Date;
}

const SymptomSchema = new Schema<ISymptom>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const ChildSchema = new Schema<IChild>(
  {
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    age: { type: Number, required: true, min: 0 },
    symptoms: [SymptomSchema],
  },
  { timestamps: true }
);

export const Child: Model<IChild> =
  mongoose.models.Child || mongoose.model<IChild>("Child", ChildSchema);