import { Document, Types } from "mongoose";



export interface IModification {
  modificationType:string;
  amount:number;
}
export interface IMobileApp extends Document {
  id:string;
  title:string;
  logo:string;
  appUrl:string;
  templateId:Types.ObjectId;
  askPriceModification:IModification;
  bidPriceModification:IModification;
  businessId:Types.ObjectId;
}