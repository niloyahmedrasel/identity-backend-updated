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
  jewellery22k:IModification;
  gold9999Gm:IModification;
  tenTola:IModification;
  gold9999Kg:IModification;
  kilobar995:IModification;
  askPriceModification:IModification;
  bidPriceModification:IModification;
  businessId:Types.ObjectId;
}