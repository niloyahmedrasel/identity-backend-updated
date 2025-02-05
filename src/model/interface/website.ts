import { Document, Types } from "mongoose";
import { IModification } from "./mobileApp";
export interface IWebsite extends Document {
  id:string;
  title: string;
  logo:string;
  domain:string;
  templateId:Types.ObjectId;
  jewellery22k:IModification;
  gold9999Gm:IModification;
  tenTola:IModification;
  gold9999Kg:IModification;
  kilobar995:IModification;
  askPriceModification:IModification
  bidPriceModification:IModification
  businessId:Types.ObjectId;
  primaryUrl?: string;
}