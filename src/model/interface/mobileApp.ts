import { Document, Types } from "mongoose";



export interface IMobileModification {
  modificationType:string;
  amount:number;
}
export interface IMobileApp extends Document {
  id:string;
  title:string;
  logo:string;
  appUrl:string;
  templateId:Types.ObjectId;
  askPriceModification:IMobileModification;
  bidPriceModification:IMobileModification;
  businessId:Types.ObjectId;
}