import express from "express";
import { IServiceResult } from "../service/baseService";
import { ApiResponse, generateMetadata, ApiError } from "../utils/api.response";
import jwt from "jsonwebtoken";
import { UserSerivce } from "../service/user";
import { UserRepository } from "../repostiory/user";

const userRepository = new UserRepository();
const jwtSecret = process.env.JWT_SECRET_KEY || "secret_key";
export class UserController {
  private metadata = generateMetadata("v1.0.0");
 

  async getUser(req: express.Request, res: express.Response): Promise<any> {
    try {
      const userId = req.params.userId as string;
      const authService = res.locals.kauth?.authService;

      const userSerivce = new UserSerivce(authService);
      const serviceResponse = await userSerivce.getUser(userId, {
        throwError: true,
      });

      return ApiResponse.success({
        response: res,
        ...serviceResponse,
        message: "User retrieved successfully",
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      console.log(error instanceof ApiError);

      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }

  async getUserByPhone(req: express.Request, res: express.Response): Promise<any> {
    try {
      const phoneNo = req.params.phone as string;
      const authService = res.locals.kauth?.authService;

      const userSerivce = new UserSerivce(authService);
      const serviceResponse = await userSerivce.getUserByPhone(phoneNo, {
        throwError: true,
      });

      return ApiResponse.success({
        response: res,
        ...serviceResponse,
        message: "User retrieved successfully",
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      console.log(error instanceof ApiError);

      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }

  async getUsers(req: express.Request, res: express.Response): Promise<any> {
    try {
      const { page, length, filters, sorts } = req.query;

      const authService = res.locals.kauth?.authService;

      console.log("i am here");
      console.log(authService);
      const userSerivce = new UserSerivce(authService);
      const serviceResponse: IServiceResult = await userSerivce.getUsers(
        {
          page: Number(page),
          length: Number(length),
          filters: filters as string,
          sorts: sorts as string,
        },
        { paginate: true, throwError: true }
      );

      return ApiResponse.success({
        response: res,
        ...serviceResponse,
        message: "Users retrieved successfully",
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }

  async fieldExists(req: express.Request, res: express.Response): Promise<any> {
    try {
      const { query } = req;
      const [firstKey, firstValue] = Object.entries(query)[0] || [];

      const user = await new UserRepository().findOne({
        [firstKey]: firstValue,
      });

      const data = {
        firstKey: firstValue,
        exists: !(user == null),
        id: user?.id,
      };

      const message =
        user == null ? `${firstKey} available` : `${firstKey} unavailable`;

      return ApiResponse.success({
        response: res,
        data: data,
        message: message,
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }

  async updateProfile(req: express.Request, res: express.Response): Promise<any> {
    try {
      const userId = req.params.userId as string;
      const { firstName, lastName } = req.body;
      const authService = res.locals.kauth?.authService;

      const serviceResponse: IServiceResult = await new UserSerivce(
        authService
      ).updateUser(userId, { firstName, lastName }, { throwError: true });

      return ApiResponse.success({
        response: res,
        ...serviceResponse,
        message: "Profile updated successfully",
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }

  async updatePassword(req: express.Request, res: express.Response): Promise<any> {
    try {
      const userId = req.params.userId as string;
      const { password } = req.body;
      const authService = res.locals.kauth?.authService;

      const serviceResponse: IServiceResult = await new UserSerivce(
        authService
      ).updatePassword(userId, password, { throwError: true });

      return ApiResponse.success({
        response: res,
        ...serviceResponse,
        message: "Password updated successfully",
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }

  async tradeToken(req: express.Request, res: express.Response): Promise<any> {
    try {
      const Trade_token = await new UserSerivce(
        res.locals.kauth?.authService
      ).getTradeToken();

      // Pass the axios response data to the success method
      return ApiResponse.success({
        response: res,
        data: {
          TradeToken: Trade_token,
        },
        message: "Trade token retrieved successfully",
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      console.log("error", error);
      // Handle errors and send an error response
      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }

  async addUserToGroup(req: express.Request, res: express.Response): Promise<any> {
    try {
      const userId = req.params.userId as string;
      const { group } = req.body;
      const authService = res.locals.kauth?.authService;

      const serviceResponse: IServiceResult = await new UserSerivce(
        authService
      ).addUserToGroup({ userId: userId, targetGroupName: group });

      return ApiResponse.success({
        response: res,
        ...serviceResponse,
        message: "User added to group successfully",
        metadata: this.metadata,
      });
    } catch (error: ApiError | any) {
      return ApiResponse.error({
        response: res,
        error: error,
        metadata: this.metadata,
      });
    }
  }
}
