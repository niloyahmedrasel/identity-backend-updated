import { IWebsite } from "./interface/website";

import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema<IWebsite>({
  id: { type: String, required: true },
  title: { type: String },
  logo: { type: String},
  domain: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },
  askPriceModification: 
    {
      modificationType: { type: String, enum: ["Premium", "Discount"], required: true },
      amount: { type: Number, required: true },
    },
  bidPriceModification:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"], required: true },
      amount: { type: Number, required: true },
    },
  businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export const Website = mongoose.model<IWebsite>("Website", websiteSchema);
