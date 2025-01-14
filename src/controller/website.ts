import { Request, Response } from "express";
import { WebsiteService } from "../service/website";
import mongoose, { Types } from "mongoose";
import { WebsiteRepository } from "../repostiory/website";
import { AppError } from "../utils/appError";
import path from "path";

const websiteService = new WebsiteService();
const websiteRepository = new WebsiteRepository();
export class WebsiteController {
  async createWebsite(req: Request, res: Response): Promise<any> {
    try {
      const businessId = new mongoose.Types.ObjectId(req.body.businessId);
      const { title, domain, templateId, pricePloicy, amount, primaryUrl } =
        req.body;

      const logo = req.file && req.file.originalname;

      if (!logo) {
        return res
          .status(400)
          .json({ errorCode: 1001, message: "Logo is required." });
      }

      const response = await websiteService.createWebsite(
        businessId,
        title,
        logo,
        domain,
        templateId as Types.ObjectId,
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
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 500 : statusCode,message});
    }
  }

  async getAllWebsites(req: Request, res: Response): Promise<any> {
    const businessId = req.query.businessId;
    try {
      if (businessId) {
        const response = await websiteRepository.findOne({
          businessId: new Types.ObjectId(businessId as string),
        });

        if (!response) {
          return res
            .status(404)
            .json({ message: "Website not found , businessId is not valid" });
        }
        res
          .status(200)
          .json({ message: "Websites retrieved successfully", data: response });
      } else {
        const response = await websiteService.getAllWebsites();
        res
          .status(200)
          .json({ message: "Websites retrieved successfully", data: response });
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

  async getbyBusinessId(req: Request, res: Response): Promise<any> {
    try {
      const businessId = req.params.businessId;

      console.log(businessId)

      const response = await websiteService.getWebsitesByBusinessId(
        new Types.ObjectId(businessId)
      );
      console.log(response)

      res
        .status(200)
        .json({ message: "Websites retrieved successfully", data: response });
    } catch (error) {
      console.log(error)
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
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ errorCode: statusCode === 500 ? 500 : statusCode, message });
    }
  }

  async updateWebsite(req: Request, res: Response): Promise<any> {
    try {
      const { websiteId } = req.params;
      console.log(websiteId)
      // Validate websiteId
      if (!websiteId || !Types.ObjectId.isValid(websiteId)) {
        return res.status(400).json({ message: "Invalid Website ID" });
      }
  
      const updateData: any = {
        title: req.body.title,
        domain: req.body.domain,
        amount: req.body.amount ? parseFloat(req.body.amount) : undefined,
        pricePloicy: req.body.pricePloicy,
      };
  
      // Validate and convert optional ObjectId fields

      if (req.body.templateId) {
        if (!Types.ObjectId.isValid(req.body.templateId)) {
          return res.status(400).json({ message: "Invalid Template ID" });
        }
        updateData.templateId = new Types.ObjectId(req.body.templateId);
      }
  
      if (req.body.businessId) {
        if (!Types.ObjectId.isValid(req.body.businessId)) {
          return res.status(400).json({ message: "Invalid Business ID" });
        }
        updateData.businessId = new Types.ObjectId(req.body.businessId);
      }
  
      // Handle file upload for logo
      if (req.file) {
        updateData.logo = path.basename(req.file.path)
      }
  
      // Call the service
      const updatedWebsite = await websiteService.updateWebsite(
        new Types.ObjectId(websiteId),
        updateData
      );
  
      if (!updatedWebsite) {
        return res.status(404).json({ message: "Website not found" });
      }
  
      res.status(200).json({ message: "Website updated successfully", data: updatedWebsite });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";
  
      res.status(statusCode).json({
        errorCode: statusCode,
        message,
      });
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
