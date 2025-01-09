import { Document, Types } from "mongoose";

export interface IMobileApp extends Document {
  id:string;
  title:string;
  logo:string;
  appUrl:string;
  templateId:Types.ObjectId;
  pricePloicy:string;
  amount:number;
  businessId:Types.ObjectId;
}