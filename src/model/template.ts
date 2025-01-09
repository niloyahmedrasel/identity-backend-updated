import mongoose from "mongoose";
import {ITemplate} from "./interface/template";

const templateSchema = new mongoose.Schema<ITemplate>({
  id: { type: String },
  templateName: { type: String, required: true },
  category: { type: String, required: true },
});

export const Template = mongoose.model<ITemplate>("Template", templateSchema)