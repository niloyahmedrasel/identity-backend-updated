import { Request, Response } from "express";
import { WebsiteService } from "../service/website";
import mongoose, { Types } from "mongoose";
import { WebsiteRepository } from "../repostiory/website";
import { AppError } from "../utils/appError";
import path from "path";
import { IModification } from "../model/interface/mobileApp";


const websiteService = new WebsiteService();
const websiteRepository = new WebsiteRepository();
export class WebsiteController {
  async createWebsite(req: Request, res: Response): Promise<any> {
    try {
      const businessId = new mongoose.Types.ObjectId(req.body.businessId);
      const { title, domain, templateId, primaryUrl,jewellery22k,gold9999Gm,tenTola,gold9999Kg,kilobar995, askPriceModification, bidPriceModification } = req.body;

      const logo = req.file && req.file.originalname || "";


      const response = await websiteService.createWebsite(
        businessId,
        title,
        logo,
        domain,
        new mongoose.Types.ObjectId(templateId), 
        jewellery22k,
        gold9999Gm,
        tenTola,
        gold9999Kg,
        kilobar995,
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
            .status(200)
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
      const updateData = { ...req.body }; 
  
      if (updateData.askPriceModification) {
        try {
          updateData.askPriceModification = JSON.parse(updateData.askPriceModification);
        } catch (error) {
          throw new AppError("Invalid JSON format for askPriceModification.", 400);
        }
      }
  
      if (updateData.bidPriceModification) {
        try {
          updateData.bidPriceModification = JSON.parse(updateData.bidPriceModification);
        } catch (error) {
          throw new AppError("Invalid JSON format for bidPriceModification.", 400);
        }
      }
      if (updateData.jewellery22k) {
        try {
          updateData.jewellery22k = JSON.parse(updateData.jewellery22k);
        } catch (error) {
          throw new AppError("Invalid JSON format for jewellery22k.", 400);
        }
      }
      if (updateData.gold9999Gm) {
        try {
          updateData.gold9999Gm = JSON.parse(updateData.gold9999Gm);
        } catch (error) {
          throw new AppError("Invalid JSON format for gold9999Gm.", 400);
        }
      }
      if (updateData.tenTola) {
        try {
          updateData.tenTola = JSON.parse(updateData.tenTola);
        } catch (error) {
          throw new AppError("Invalid JSON format for tenTola.", 400);
        }
      }
      if (updateData.gold9999Kg) {
        try {
          updateData.gold9999Kg = JSON.parse(updateData.gold9999Kg);
        } catch (error) {
          throw new AppError("Invalid JSON format for gold9999Kg.", 400);
        }
      }
      if (updateData.kilobar995) {
        try {
          updateData.kilobar995 = JSON.parse(updateData.kilobar995);
        } catch (error) {
          throw new AppError("Invalid JSON format for kilobar995.", 400);
        }
      }
  
      const logo = req.file && req.file.originalname;
      if (logo) {
        updateData.logo = logo;
      }
  
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
