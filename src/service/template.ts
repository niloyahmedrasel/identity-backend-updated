import { Template } from "../model/template";
import { ITemplate } from "../model/interface/template";
import { Types } from "mongoose";

export class TemplateService {
  async createTemplate(templateName: string, category: string): Promise<ITemplate> {
    const id = Math.random().toString(36).substring(2, 8); 

    return await Template.create({ id, templateName, category });
  }

  async getAllTemplates(): Promise<ITemplate[]> {
    const templates = await Template.find({});
    if (templates.length === 0) {
      throw new Error("No templates found.");
    }
    return templates;
  }

  async getTemplateById(templateId: string): Promise<ITemplate | null> {
    const template = await Template.findOne({ _id: templateId });
    if (!template) {
      throw new Error(`Template with ID: ${templateId} not found.`);
    }
    return template;
  }

  async updateTemplate(templateId: string, updateData: Partial<ITemplate>): Promise<ITemplate | null> {
    const updatedTemplate = await Template.findOneAndUpdate({ _id: templateId }, updateData, { new: true });
    if (!updatedTemplate) {
      throw new Error(`Template with ID: ${templateId} not found.`);
    }
    return updatedTemplate;
  }

  async deleteTemplate(templateId: string): Promise<ITemplate | null> {
    const deletedTemplate = await Template.findOneAndDelete({ _id: templateId });
    if (!deletedTemplate) {
      throw new Error(`Template with ID: ${templateId} not found.`);
    }
    return deletedTemplate;
  }
}
