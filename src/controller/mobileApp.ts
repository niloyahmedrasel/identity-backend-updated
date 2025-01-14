import { Request, Response } from "express";
import { MobileAppService } from "../service/mobileApp";
import { Types } from "mongoose";
import { AppError } from "../utils/appError";

const mobileAppService = new MobileAppService();

export class MobileAppController {
  async createMobileApp(req: Request, res: Response) {
    try {
      const {
        title,
        logo,
        appUrl,
        templateId,
        pricePloicy,
        amount,
        businessId,
      } = req.body;

      const response = await mobileAppService.createMobileApp(
        title,
        logo,
        appUrl,
        templateId,
        pricePloicy,
        amount,
        businessId
      );

      res
        .status(201)
        .json({ message: "Mobile app created successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
    }
  }

  async getAllMobileApps(req: Request, res: Response): Promise<any> {
    const businessId = req.query.businessId;
    try {
      if (businessId) {
        const response = await mobileAppService.getMobileAppsByBusinessId(
          new Types.ObjectId(businessId as string)
        );
        if (!response) {
          return res.status(404).json({
            message: "Mobile apps not found , businessId is not valid",
          });
        }
        res.status(200).json({
          message: "Mobile apps retrieved successfully",
          data: response,
        });
      } else {
        const response = await mobileAppService.getAllMobileApps();
        res.status(200).json({
          message: "Mobile apps retrieved successfully",
          data: response,
        });
      }
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
    }
  }

  async getMobileAppsByBusinessId(req: Request, res: Response) {
    try {
      const { businessId } = req.params;

      const response = await mobileAppService.getMobileAppsByBusinessId(
        new Types.ObjectId(businessId)
      );
      res.status(200).json({
        message: "Mobile apps retrieved successfully",
        data: response,
      });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    const id = req.params.mobileAppId;

    console.log(id);
    try {
      if (!id) {
        return res.status(400).json({ message: "App ID is required" });
      }

      const response = await mobileAppService.getMobileAppById(id);

      if (!response) {
        return res.status(404).json({ message: "App not found" });
      }

      res
        .status(200)
        .json({ message: "App retrieved successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
    }
  }

  async updateMobileApp(req: Request, res: Response) {
    try {
      const { mobileAppId } = req.params;
      const updateData = req.body;

      const response = await mobileAppService.updateMobileApp(
        new Types.ObjectId(mobileAppId),
        updateData
      );

      res
        .status(200)
        .json({ message: "Mobile app updated successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
    }
  }

  async deleteMobileApp(req: Request, res: Response) {
    try {
      const { mobileAppId } = req.params;

      const response = await mobileAppService.deleteMobileApp(
        new Types.ObjectId(mobileAppId)
      );

      res
        .status(200)
        .json({ message: "Mobile app deleted successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
    }
  }
}
