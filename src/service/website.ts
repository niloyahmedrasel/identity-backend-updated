import { Types } from "mongoose";
import { WebsiteRepository } from "../repostiory/website";
import { IWebsite } from "../model/interface/website";
import { AppError } from "../utils/appError";
import { IModification } from "../model/interface/mobileApp";

const websiteRepository = new WebsiteRepository();

export class WebsiteService {
  async createWebsite(
    businessId: Types.ObjectId,
    title: string,
    logo: string,
    domain: string,
    templateId: Types.ObjectId,
    askPriceModification: string,
    bidPriceModification: string,
    primaryUrl?: string
  ): Promise<IWebsite> {
    const existBusiness = await websiteRepository.findOne({ businessId });

    if (existBusiness) {
      throw new AppError(
        "Business website already exists. Cannot create a new website.",
        200
      );
    }

    const id = Math.random().toString().substring(2, 8);

     let parsedAskPriceModification: IModification;
     let parsedBidPriceModification: IModification;
      
        try {
          parsedAskPriceModification = JSON.parse(askPriceModification);
          parsedBidPriceModification = JSON.parse(bidPriceModification);
        } catch (error) {
          throw new AppError("Invalid JSON format for price modifications.", 400);
        }

    return await websiteRepository.create({
      id,
      businessId,
      title,
      logo,
      domain,
      templateId,
      askPriceModification: parsedAskPriceModification,
      bidPriceModification: parsedBidPriceModification,
      primaryUrl,
    });
  }

  async getAllWebsites(): Promise<IWebsite[]> {
    console.log("all website");
    const websites = await websiteRepository.find({});
    if (websites.length === 0) {
      throw new AppError("No websites found.", 200);
    }
    return websites;
  }

  async getWebsitesByBusinessId(
    businessId: Types.ObjectId
  ): Promise<IWebsite[]> {
    const websites = await websiteRepository.find({businessId: businessId });
    console.log(websites);
    if (websites.length === 0) {
      throw new AppError(
        `No websites found for business ID: ${businessId}`,
        200
      );
    }
    return websites;
  }

  async getWebsiteById(websiteId: string): Promise<IWebsite | null> {
    console.log("single website");
    const website = await websiteRepository.findOne({ id: websiteId });
    if (!website) {
      throw new AppError(`Website with ID: ${websiteId} not found.`, 200);
    }
    return website;
  }

  async updateWebsite(
    websiteId: Types.ObjectId,
    updateData: Partial<IWebsite>
  ): Promise<IWebsite | null> {
    const allowedFields = [
      "title",
      "logo",
      "domain",
      "templateId",
      "askPriceModification",
      "bidPriceModification",
      "businessId",
    ];
  
    const validUpdates = Object.keys(updateData).filter((key) =>
      allowedFields.includes(key)
    );
  
    if (validUpdates.length === 0) {
      throw new AppError("No valid fields provided for update.", 400);
    }
  
    const updatedWebsite = await websiteRepository.updateByID(
      websiteId.toString(),
      updateData
    );
  
    if (!updatedWebsite) {
      throw new AppError(`Website with ID: ${websiteId} not found.`, 200);
    }
  
    return updatedWebsite;
  }

  async deleteWebsite(websiteId: Types.ObjectId): Promise<IWebsite | null> {
    const deletedWebsite = await websiteRepository.deleteById(
      websiteId.toString()
    );
    if (!deletedWebsite) {
      throw new AppError(`Website with ID: ${websiteId} not found.`, 200);
    }
    return deletedWebsite;
  }
}
