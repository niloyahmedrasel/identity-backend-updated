import { Types } from "mongoose";
import { WebsiteRepository } from "../repostiory/website";
import { IWebsite } from "../model/interface/website";

const websiteRepository = new WebsiteRepository();

export class WebsiteService {
  async createWebsite(
    businessId: Types.ObjectId,
    title: string,
    logo: string,
    domain: string,
    templateId: Types.ObjectId,
    pricePloicy: string,
    amount: number,
    primaryUrl?: string
  ): Promise<IWebsite> {
    const existBusiness = await websiteRepository.findOne({ businessId });

    if (existBusiness) {
      throw new Error("Business website already exists. Cannot create a new website.");
    }

    const id = Math.random().toString(36).substring(2, 8);

    return await websiteRepository.create({ id, businessId, title, logo, domain, templateId, pricePloicy, amount, primaryUrl });
  }

  async getAllWebsites(): Promise<IWebsite[]> {
    const websites = await websiteRepository.find({});
    if (websites.length === 0) {
      throw new Error("No websites found.");
    }
    return websites;
  }

  async getWebsitesByBusinessId(businessId: Types.ObjectId): Promise<IWebsite[]> {
    const websites = await websiteRepository.find({ businessId });
    if (websites.length === 0) {
      throw new Error(`No websites found for business ID: ${businessId}`);
    }
    return websites;
  }

  async getWebsiteById(websiteId: string): Promise<IWebsite | null> {
    const website = await websiteRepository.findOne({id:websiteId});
    if (!website) {
      throw new Error(`Website with ID: ${websiteId} not found.`);
    }
    return website;
  }

  async updateWebsite(
    websiteId: Types.ObjectId,
    updateData: Partial<IWebsite>
  ): Promise<IWebsite | null> {
    const updatedWebsite = await websiteRepository.updateByID(websiteId.toString(), updateData);
    if (!updatedWebsite) {
      throw new Error(`Website with ID: ${websiteId} not found.`);
    }
    return updatedWebsite;
  }

  async deleteWebsite(websiteId: Types.ObjectId): Promise<IWebsite | null> {
    const deletedWebsite = await websiteRepository.deleteById(websiteId.toString());
    if (!deletedWebsite) {
      throw new Error(`Website with ID: ${websiteId} not found.`);
    }
    return deletedWebsite;
  }
}
