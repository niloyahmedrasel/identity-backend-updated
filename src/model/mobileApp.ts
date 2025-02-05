import { IMobileApp } from "./interface/mobileApp";
import mongoose from "mongoose";


const mobileAppSchema = new mongoose.Schema<IMobileApp>({
  id: { type: String, required: true },
  title: { type: String},
  logo: { type: String},
  appUrl: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, required: true },
  jewellery22k:
    {
      modificationType: { type: String, enum: ["Premium", "Discount"] },
      amount: { type: Number },
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
      amount: { type: Number},
    },

  businessId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

export const MobileApp = mongoose.model<IMobileApp>("MobileApp", mobileAppSchema);