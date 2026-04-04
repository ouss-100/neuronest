import mongoose from "mongoose";
import { User, IUser } from "./User";

export interface IParent extends IUser {}

const parentSchema = new mongoose.Schema<IParent>({});

/* =======================
   PARENT DISCRIMINATOR
======================= */
export const Parent =
  (mongoose.models.Parent as mongoose.Model<IParent>) ||
  User.discriminator<IParent>("Parent", parentSchema);