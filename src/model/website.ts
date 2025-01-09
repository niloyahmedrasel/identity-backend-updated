import { IWebsite } from "./interface/website";

import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema<IWebsite>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  logo: { type: String, required: true },
  domain: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, required: true },
  pricePloicy: { type: String, required: true },
  amount: { type: Number, required: true },
  businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export const Website = mongoose.model<IWebsite>("Website", websiteSchema);
