import { Document, Types } from "mongoose";

export interface IModification {
  modificationType:string;
  amount:number;
}

export interface IWebsite extends Document {
  id:string;
  title: string;
  logo:string;
  domain:string;
  templateId:Types.ObjectId;
  askPriceModification:IModification[]
  bidPriceModification:IModification[]
  businessId:Types.ObjectId;
  primaryUrl?: string;
}