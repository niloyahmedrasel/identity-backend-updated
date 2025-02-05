import { IWebsite } from "./interface/website";

import mongoose from "mongoose";

const websiteSchema = new mongoose.Schema<IWebsite>({
  id: { type: String, required: true },
  title: { type: String },
  logo: { type: String},
  domain: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, ref: "Template", required: true },
  jewellery22k:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"]},
      amount: { type: Number},
    },
  gold9999Gm:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"]},
      amount: { type: Number},
    },
  tenTola:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"]},
      amount: { type: Number},
    },
  gold9999Kg:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"]},
      amount: { type: Number},
    },
  kilobar995:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"]},
      amount: { type: Number},
    },
  askPriceModification: 
    {
      modificationType: { type: String, enum: ["Premium", "Discount"]},
      amount: { type: Number},
    },
  bidPriceModification:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"]},
      amount: { type: Number },
    },
  businessId: { type: mongoose.Schema.Types.ObjectId },
});

export const Website = mongoose.model<IWebsite>("Website", websiteSchema);
