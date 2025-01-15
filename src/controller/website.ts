import { Request, Response } from "express";
import { WebsiteService } from "../service/website";
import mongoose, { Types } from "mongoose";
import { WebsiteRepository } from "../repostiory/website";
import { AppError } from "../utils/appError";
import path from "path";
import { IModification } from "../model/interface/website";

const websiteService = new WebsiteService();
const websiteRepository = new WebsiteRepository();
export class WebsiteController {
  async createWebsite(req: Request, res: Response): Promise<any> {
    try {
      const businessId = new mongoose.Types.ObjectId(req.body.businessId);
      const { title, domain, templateId, primaryUrl } = req.body;

      const logo = req.file && req.file.originalname;

      if (!logo) {
        return res
          .status(400)
          .json({ errorCode: 1001, message: "Logo is required." });
      }

      // Initialize variables with default empty arrays
      let askPriceModification: IModification[] = [];
      let bidPriceModification: IModification[] = [];

      // Parse and wrap as array if necessary
      if (req.body.askPriceModification) {
        try {
          const parsedData = JSON.parse(req.body.askPriceModification);
          askPriceModification = Array.isArray(parsedData)
            ? parsedData
            : [parsedData]; // Wrap single object in an array
        } catch (err) {
          return res.status(400).json({
            message: "Invalid JSON format or structure for askPriceModification.",
          });
        }
      }

      if (req.body.bidPriceModification) {
        try {
          const parsedData = JSON.parse(req.body.bidPriceModification);
          bidPriceModification = Array.isArray(parsedData)
            ? parsedData
            : [parsedData]; // Wrap single object in an array
        } catch (err) {
          return res.status(400).json({
            message: "Invalid JSON format or structure for bidPriceModification.",
          });
        }
      }

      const response = await websiteService.createWebsite(
        businessId,
        title,
        logo,
        domain,
        new mongoose.Types.ObjectId(templateId), // Ensure proper conversion
        askPriceModification,
        bidPriceModification,
        primaryUrl
      );

      res.status(200).json({
        message: "Website created successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =
        error instanceof AppError
          ? error.message
          : "An unexpected error occurred";

      res.status(statusCode).json({
        errorCode: statusCode === 500 ? 500 : statusCode,
        message,
      });
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
  
      // Validate websiteId
      if (!websiteId || !Types.ObjectId.isValid(websiteId)) {
        return res.status(400).json({ message: "Invalid Website ID" });
      }
  
      // Initialize updateData object
      const updateData: any = {
        title: req.body.title,
        domain: req.body.domain,
      };
  
      // Parse and validate `askPriceModification`
      if (req.body.askPriceModification) {
        try {
          const parsedData = JSON.parse(req.body.askPriceModification);
          updateData.askPriceModification = Array.isArray(parsedData)
            ? parsedData
            : [parsedData]; // Wrap single object in an array
        } catch (err) {
          return res.status(400).json({
            message: "Invalid JSON format or structure for askPriceModification.",
          });
        }
      }
  
      // Parse and validate `bidPriceModification`
      if (req.body.bidPriceModification) {
        try {
          const parsedData = JSON.parse(req.body.bidPriceModification);
          updateData.bidPriceModification = Array.isArray(parsedData)
            ? parsedData
            : [parsedData]; // Wrap single object in an array
        } catch (err) {
          return res.status(400).json({
            message: "Invalid JSON format or structure for bidPriceModification.",
          });
        }
      }
  
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
        updateData.logo = path.basename(req.file.path);
      }
  
      // Call the service to update the website
      const updatedWebsite = await websiteService.updateWebsite(
        new Types.ObjectId(websiteId),
        updateData
      );
  
      if (!updatedWebsite) {
        return res.status(404).json({ message: "Website not found" });
      }
  
      res.status(200).json({
        message: "Website updated successfully",
        data: updatedWebsite,
      });
    } catch (error) {
      console.log(error);
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
