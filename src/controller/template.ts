import { Request, Response } from "express";
import { TemplateService } from "../service/template";
import { AppError } from "../utils/appError";

const templateService = new TemplateService();

export class TemplateController {
  async createTemplate(req: Request, res: Response) {
    try {
      const { templateName, category } = req.body;

      const response = await templateService.createTemplate(templateName, category);

      res.status(201).json({ message: "Template created successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async getAllTemplates(req: Request, res: Response) {
    try {
      const response = await templateService.getAllTemplates();
      res.status(200).json({ message: "Templates retrieved successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async getTemplateById(req: Request, res: Response) {
    try {
      const { templateId } = req.params;

      const response = await templateService.getTemplateById(templateId);
      res.status(200).json({ message: "Template retrieved successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async updateTemplate(req: Request, res: Response) {
    try {
      const { templateId } = req.params;
      const updateData = req.body;

      const response = await templateService.updateTemplate(templateId, updateData);

      res.status(200).json({ message: "Template updated successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }

  async deleteTemplate(req: Request, res: Response) {
    try {
      const { templateId } = req.params;

      const response = await templateService.deleteTemplate(templateId);

      res.status(200).json({ message: "Template deleted successfully", data: response });
    } catch (error) {
      const statusCode = error instanceof AppError ? error.statusCode : 500;
      const message =error instanceof AppError? error.message: "An unexpected error occurred";

      res.status(statusCode).json({errorCode: statusCode === 500 ? 1000 : statusCode, message, });
    }
  }
}
