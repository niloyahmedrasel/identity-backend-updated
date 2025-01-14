import { Request, Response } from "express";
import { WebsiteService } from "../service/website";
import mongoose, { Types } from "mongoose";
import { WebsiteRepository } from "../repostiory/website";
import { AppError } from "../utils/appError";

const websiteService = new WebsiteService();
const websiteRepository = new WebsiteRepository();
export class WebsiteController {
  async createWebsite(req: Request, res: Response): Promise<any> {
    try {
      const businessId = new mongoose.Types.ObjectId(req.body.businessId);
      const {
        title,
        domain,
        templateId,
        pricePloicy,
        amount,
        primaryUrl,
      } = req.body;

      const logo = req.file && req.file.originalname;

      if (!logo) {
        return res.status(400).json({ errorCode: 1001, message: "Logo is required." });
      }

      const response = await websiteService.createWebsite(
        businessId,
        title,
        logo,
        domain,
        templateId,
        pricePloicy,
        amount,
        primaryUrl
      );

      res.status(200).json({
        message: "Website created successfully",
        data: response,
      });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res.status(statusCode).json({
        errorCode: statusCode === 500 ? 1000 : statusCode, // Map statusCode to errorCode if needed
        message,
      });
    }
  }

  async getAllWebsites(req: Request, res: Response) {

    const businessId = req.query.businessId;
    try {
      if(businessId){
        const response = await websiteRepository.findOne({businessId: new Types.ObjectId(businessId as string)});
        res.status(200).json({ message: "Websites retrieved successfully", data: response });
      }
      else{
        const response = await websiteService.getAllWebsites();
        res.status(200).json({ message: "Websites retrieved successfully", data: response });
      }
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async getbyBusinessId(req: Request, res: Response): Promise<any> {
    try {
      const businessId = req.params.businessId;

      const response = await websiteService.getWebsitesByBusinessId(
        new Types.ObjectId(businessId)
      );

      res.status(200).json({ message: "Websites retrieved successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    const id = req.params.websiteId;

    console.log(id);
    try {
      if (!id) {
        return res.status(400).json({ message: "Website ID is required" });
      }

      const response = await websiteService.getWebsiteById(id);

      if (!response) {
        return res.status(404).json({ message: "Website not found" });
      }

      res
        .status(200)
        .json({ message: "Website retrieved successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async updateWebsite(req: Request, res: Response): Promise<any> {
    try {
      const { websiteId } = req.params;
      const updateData = req.body;

      if (!websiteId) {
        return res.status(400).json({ message: "Website ID is required" });
      }

      const response = await websiteService.updateWebsite(
        new Types.ObjectId(websiteId),
        updateData
      );

      if (!response) {
        return res.status(404).json({ message: "Website not found" });
      }

      res
        .status(200)
        .json({ message: "Website updated successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async deleteWebsite(req: Request, res: Response): Promise<any> {
    try {
      const { websiteId } = req.params;

      if (!websiteId) {
        return res.status(400).json({ message: "Website ID is required" });
      }

      const response = await websiteService.deleteWebsite(
        new Types.ObjectId(websiteId)
      );

      if (!response) {
        return res.status(404).json({ message: "Website not found" });
      }

      res
        .status(200)
        .json({ message: "Website deleted successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }
}
