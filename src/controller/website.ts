import { Request, Response } from "express";
import { WebsiteService } from "../service/website";
import { Types } from "mongoose";

const websiteService = new WebsiteService();

export class WebsiteController {
  async createWebsite(req: Request, res: Response) {
    try {
      const {
        businessId,
        title,
        logo,
        domain,
        templateId,
        pricePloicy,
        amount,
        primaryUrl,
      } = req.body;

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

      if (!response) {
        res.status(400).json({ message: "Failed to create website" });
      }
      res
        .status(200)
        .json({ message: "Website created successfully", data: response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ message: errorMessage });
    }
  }

  async getAllWebsites(req: Request, res: Response) {
    try {
      const response = await websiteService.getAllWebsites();
      res
        .status(200)
        .json({ message: "Websites retrieved successfully", data: response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ message: errorMessage });
    }
  }

  async getbyBusinessId(req: Request, res: Response): Promise<any> {
    try {
      const businessId = req.params.businessId;

      if (!businessId) {
        return res.status(400).json({ message: "Business ID is required" });
      }

      const response = await websiteService.getWebsitesByBusinessId(
        new Types.ObjectId(businessId)
      );
      res
        .status(200)
        .json({ message: "Websites retrieved successfully", data: response });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ message: errorMessage });
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
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ message: errorMessage });
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
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ message: errorMessage });
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
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      res.status(500).json({ message: errorMessage });
    }
  }
}
