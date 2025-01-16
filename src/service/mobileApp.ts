import { Types } from "mongoose";
import { MobileApp } from "../model/mobileApp";
import { IMobileApp, IMobileModification } from "../model/interface/mobileApp";
import { AppError } from "../utils/appError";

export class MobileAppService {
  async createMobileApp(
    title: string,
    logo: string,
    appUrl: string,
    templateId: Types.ObjectId,
    askPriceModification: string, 
    bidPriceModification: string, 
    businessId: Types.ObjectId
  ): Promise<IMobileApp> {
    
    const existingMobileApp = await MobileApp.findOne({ businessId });
  
    if (existingMobileApp) {
      throw new AppError(
        "Business already has a mobile app. Cannot create another one.",
        200
      );
    }
  
    
    const id = Math.random().toString().substring(2, 8);
  
    
    let parsedAskPriceModification: IMobileModification;
    let parsedBidPriceModification: IMobileModification;
  
    try {
      parsedAskPriceModification = JSON.parse(askPriceModification);
      parsedBidPriceModification = JSON.parse(bidPriceModification);
    } catch (error) {
      throw new AppError("Invalid JSON format for price modifications.", 400);
    }
  
    
    return await MobileApp.create({
      id,
      title,
      logo,
      appUrl,
      templateId,
      askPriceModification: parsedAskPriceModification,
      bidPriceModification: parsedBidPriceModification,
      businessId,
    });
  }

  async getAllMobileApps(): Promise<IMobileApp[]> {
    const mobileApps = await MobileApp.find({});
    if (mobileApps.length === 0) {
      throw new AppError("No mobile apps found.", 200);
    }
    return mobileApps;
  }

  async getMobileAppsByBusinessId(
    businessId: Types.ObjectId
  ): Promise<IMobileApp[]> {
    const mobileApps = await MobileApp.find({ businessId });
    if (mobileApps.length === 0) {
      throw new AppError(`No mobile apps found for business ID: ${businessId}`,200);
    }
    return mobileApps;
  }

  async getMobileAppById(mobileAppId: string): Promise<IMobileApp | null> {
    const mobileApp = await MobileApp.findOne({ id: mobileAppId });
    if (!mobileApp) {
      throw new AppError(`Mobile app with ID: ${mobileAppId} not found.`, 200);
    }
    return mobileApp;
  }

  async updateMobileApp(
    mobileAppId: Types.ObjectId,
    updateData: Partial<IMobileApp>
  ): Promise<IMobileApp | null> {
    const updatedMobileApp = await MobileApp.findByIdAndUpdate(
      mobileAppId,
      updateData,
      { new: true }
    );
    if (!updatedMobileApp) {
      throw new AppError(`Mobile app with ID: ${mobileAppId} not found.`, 200);
    }
    return updatedMobileApp;
  }

  async deleteMobileApp(
    mobileAppId: Types.ObjectId
  ): Promise<IMobileApp | null> {
    const deletedMobileApp = await MobileApp.findByIdAndDelete(mobileAppId);
    if (!deletedMobileApp) {
      throw new AppError(`Mobile app with ID: ${mobileAppId} not found.`, 200);
    }
    return deletedMobileApp;
  }
}
