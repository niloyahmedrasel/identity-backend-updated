import { Types } from "mongoose";
import { MobileApp } from "../model/mobileApp";
import { IMobileApp } from "../model/interface/mobileApp";
import { AppError } from "../utils/appError";

export class MobileAppService {
  async createMobileApp(
    title: string,
    logo: string,
    appUrl: string,
    templateId: Types.ObjectId,
    pricePloicy: string,
    amount: number,
    businessId: Types.ObjectId
  ): Promise<IMobileApp> {
    const existingMobileApp = await MobileApp.findOne({ businessId });

    if (existingMobileApp) {
      throw new Error("Business already has a mobile app. Cannot create another one.");
    }

    const id = Math.random().toString().substring(2, 8);

    return await MobileApp.create({
      id,
      title,
      logo,
      appUrl,
      templateId,
      pricePloicy,
      amount,
      businessId,
    });
  }

  async getAllMobileApps(): Promise<IMobileApp[]> {
    const mobileApps = await MobileApp.find({});
    if (mobileApps.length === 0) {
      throw new AppError("No mobile apps found.",404);
    }
    return mobileApps;
  }

  async getMobileAppsByBusinessId(businessId: Types.ObjectId): Promise<IMobileApp[]> {
    const mobileApps = await MobileApp.find({ businessId });
    if (mobileApps.length === 0) {
      throw new Error(`No mobile apps found for business ID: ${businessId}`);
    }
    return mobileApps;
  }

  async getMobileAppById(mobileAppId: string): Promise<IMobileApp | null> {
    const mobileApp = await MobileApp.findOne({id:mobileAppId});
    if (!mobileApp) {
      throw new AppError(`Mobile app with ID: ${mobileAppId} not found.`,404);
    }
    return mobileApp;
  }

  async updateMobileApp(
    mobileAppId: Types.ObjectId,
    updateData: Partial<IMobileApp>
  ): Promise<IMobileApp | null> {
    const updatedMobileApp = await MobileApp.findByIdAndUpdate(mobileAppId, updateData, { new: true });
    if (!updatedMobileApp) {
      throw new AppError(`Mobile app with ID: ${mobileAppId} not found.`,404);
    }
    return updatedMobileApp;
  }

  async deleteMobileApp(mobileAppId: Types.ObjectId): Promise<IMobileApp | null> {
    const deletedMobileApp = await MobileApp.findByIdAndDelete(mobileAppId);
    if (!deletedMobileApp) {
      throw new AppError(`Mobile app with ID: ${mobileAppId} not found.`,404);
    }
    return deletedMobileApp;
  }
}
