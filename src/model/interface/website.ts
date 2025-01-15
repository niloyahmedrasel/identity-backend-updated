import { Document, Types } from "mongoose";

export interface IWebsite extends Document {
  id:string;
  title: string;
  logo:string;
  domain:string;
  templateId:Types.ObjectId;
  pricePloicy:string;
  askRate:number;
  bidRate:number;
  businessId:Types.ObjectId;
  primaryUrl?: string;
}