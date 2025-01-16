import { IMobileApp } from "./interface/mobileApp";
import mongoose from "mongoose";


const mobileAppSchema = new mongoose.Schema<IMobileApp>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  logo: { type: String, required: true },
  appUrl: { type: String, required: true },
  templateId: { type: mongoose.Schema.Types.ObjectId, required: true },
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

export const MobileApp = mongoose.model<IMobileApp>("MobileApp", mobileAppSchema);