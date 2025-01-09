import { Document, Types } from "mongoose";

export interface IWebsite extends Document {
  id:string;
  title: string;
  logo:string;
  domain:string;
  templateId:Types.ObjectId;
  pricePloicy:string;
  amount:number;
  businessId:Types.ObjectId;
  primaryUrl?: string;
}