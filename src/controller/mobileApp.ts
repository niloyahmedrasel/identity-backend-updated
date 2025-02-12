import { Request, Response } from "express";
import { MobileAppService } from "../service/mobileApp";
import { Types } from "mongoose";
import { AppError } from "../utils/appError";
import { IModification } from "../model/interface/mobileApp";

const mobileAppService = new MobileAppService();

export class MobileAppController {
  async createMobileApp(req: Request, res: Response): Promise<any> {
    try {
      const {
        title,
        appUrl,
        templateId,
        jewellery22k,
        gold9999Gm,
        tenTola,
        gold9999Kg,
        kilobar995,
        askPriceModification,
        bidPriceModification,
        businessId,
      } = req.body;

      const logo = req.file && req.file.originalname || "";


      const response = await mobileAppService.createMobileApp(
        title,
        logo,
        appUrl,
        templateId,
        jewellery22k,
        gold9999Gm,
        tenTola,
        gold9999Kg,
        kilobar995,
        askPriceModification,
        bidPriceModification,
        businessId
      );

      res
        .status(201)
        .json({ message: "Mobile app created successfully", data: response });
    } catch (error) {
      console.log(error);
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

    console.log(businessId,"businessId");
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

      res.status(200).json({ message: "App retrieved successfully", data: response });
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
  
      // Handle file upload for logo if present.
      const logo = req.file && req.file.originalname;
      if (logo) {
        updateData.logo = logo;
      }
  
      // Call the service to update the mobile app.
      const response = await mobileAppService.updateMobileApp(
        new Types.ObjectId(mobileAppId),
        updateData
      );
  
      res.status(200).json({ message: "Mobile app updated successfully", data: response });
    } catch (error) {
      console.error(error);
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
