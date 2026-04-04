import mongoose from "mongoose";
import { User, IUser } from "./User";

export interface IAdmin extends IUser {}

const adminSchema = new mongoose.Schema<IAdmin>({});

export const Admin =
  (mongoose.models.Admin as mongoose.Model<IAdmin>) ||
  User.discriminator<IAdmin>("Admin", adminSchema);