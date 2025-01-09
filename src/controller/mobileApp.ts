import { Request, Response } from "express";
import { MobileAppService } from "../service/mobileApp";
import { Types } from "mongoose";

const mobileAppService = new MobileAppService();

export class MobileAppController {
  async createMobileApp(req: Request, res: Response) {
    try {
      const { title, logo, appUrl, templateId, pricePloicy, amount, businessId } = req.body;

      const response = await mobileAppService.createMobileApp(
        title,
        logo,
        appUrl,
        templateId,
        pricePloicy,
        amount,
        businessId
      );

      res.status(201).json({ message: "Mobile app created successfully", data: response });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async getAllMobileApps(req: Request, res: Response) {
    try {
      const response = await mobileAppService.getAllMobileApps();
      res.status(200).json({ message: "Mobile apps retrieved successfully", data: response });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  async getMobileAppsByBusinessId(req: Request, res: Response) {
    try {
      const { businessId } = req.params;

      const response = await mobileAppService.getMobileAppsByBusinessId(new Types.ObjectId(businessId));
      res.status(200).json({ message: "Mobile apps retrieved successfully", data: response });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  async updateMobileApp(req: Request, res: Response) {
    try {
      const { mobileAppId } = req.params;
      const updateData = req.body;

      const response = await mobileAppService.updateMobileApp(new Types.ObjectId(mobileAppId), updateData);

      res.status(200).json({ message: "Mobile app updated successfully", data: response });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }

  async deleteMobileApp(req: Request, res: Response) {
    try {
      const { mobileAppId } = req.params;

      const response = await mobileAppService.deleteMobileApp(new Types.ObjectId(mobileAppId));

      res.status(200).json({ message: "Mobile app deleted successfully", data: response });
    } catch (error) {
      res.status(404).json({ message: (error as Error).message });
    }
  }
}
