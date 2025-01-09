import { Document } from "mongoose";

export interface ITemplate extends Document {
  id: string;
  templateName: string;
  category: string;
}
