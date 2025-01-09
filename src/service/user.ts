import {
  BaseService,
  IServiceOptions,
  DefaultOptionValue,
  IServiceResult,
} from "./baseService";
import { AuthService } from "./AuthService";
import { FilterParamsDecoder, SortParamsDecoder } from "../utils/paramsDecoder";
import { UserRepository } from "../repostiory/user";
import { IUserData } from "../store/userStore";
import axios from "axios";
import {
  TRADE_APP_EMAIL,
  TRADE_APP_PASSWORD,
  TRADE_APP_URL,
} from "../config/trade";

export class UserSerivce extends BaseService {
  protected searchableFields = {
    id: ["eq", "ne"],
    email: ["eq", "ne"],
    username: ["eq", "ne"],
    firstName: ["eq", "ne", "like"],
    lastName: ["eq", "ne", "like"],
    phone: ["eq", "ne"],
    uid: ["eq", "ne"],
    emailVerified: ["eq", "ne"],
  };

  constructor(authservice?: AuthService) {
    super(authservice);
  }

  async getUsers(
    params: { page: number; length: number; filters?: string; sorts?: string },
    options: IServiceOptions = DefaultOptionValue
  ): Promise<IServiceResult> {
    // this.permissionCheck({
    //   resource: "user",
    //   action: "read",
    //   domain: "all",
    // }, options);
    // decode filter params
    const { filterQuery, fields } = BaseService.FilterParamsDecoder(
      params.filters
    );
    console.log(filterQuery, fields);

    // get non filterable fields and throw error if any
    this.getNonFilterableFields(fields, { throwError: true });

    // decode sort params
    const formatedSorts = params.sorts
      ? SortParamsDecoder(params.sorts)
      : undefined;

    const userRepository = new UserRepository();
    // convert page length to skip and take
    const { skip, limit } = this.paginationToSkipLimit(
      params.page,
      params.length
    );
    // Pass filters, sort, and pagination to the repository
    const users = (await userRepository.find(filterQuery, formatedSorts)).slice(
      skip,
      skip + limit
    );

    if (options.paginate !== undefined && options.paginate === true) {
      const pagination = await this.paginate(
        userRepository,
        { page: params.page, length: params.length },
        filterQuery
      );
      return {
        data: {
          Users: users,
        },
        pagination,
      };
    }

    return { data: users };
  }

  async getUser(
    userId: string,
    options: IServiceOptions = DefaultOptionValue
  ): Promise<IServiceResult> {
    // const authUser = this.authService?.getUser();
    // const p_domain = authUser?.id === userId ? "own" : "all";

    // if (!this.permissionCheck({ domain: p_domain }, options)) {
    //   return { data: undefined };
    // }
    const userRepository = new UserRepository();
    const user = await userRepository.findOne({ id: userId });
    return { data: { User: user } };
  }

  async getUserByPhone(
    phone: string,
    options: IServiceOptions = DefaultOptionValue
  ): Promise<IServiceResult> {
    // const authUser = this.authService?.getUser();
    // const p_domain = authUser?.id === userId ? "own" : "all";

    // if (!this.permissionCheck({ domain: p_domain }, options)) {
    //   return { data: undefined };
    // }
    const userRepository = new UserRepository();
    const user = await userRepository.findByPhone(phone);
    return { data: { User: user } };
  }

  async updateUser(
    userId: string,
    updatedFields: Partial<IUserData>,
    options: IServiceOptions = DefaultOptionValue
  ): Promise<IServiceResult> {
    const authUser = this.authService?.getUser();
    const p_domain = authUser?.id === userId ? "own" : "all";

    if (
      !this.permissionCheck(
        { resource: "user", action: "update", domain: p_domain },
        options
      )
    ) {
      return { data: undefined };
    }
    const userRepository = new UserRepository();
    return {
      data: {
        User: await userRepository.updateUser(userId, updatedFields),
      },
    };
  }

  async updatePassword(
    userId: string,
    password: string,
    options: IServiceOptions = DefaultOptionValue
  ): Promise<IServiceResult> {
    const authUser = this.authService?.getUser();
    const p_domain = authUser?.id === userId ? "own" : "all";

    if (
      !this.permissionCheck(
        { resource: "user", action: "update", domain: p_domain },
        options
      )
    ) {
      return { data: undefined };
    }
    const userRepository = new UserRepository();
    return {
      data: {
        User: await userRepository.updatePassword(userId, password),
      },
    };
  }

  async getTradeToken(): Promise<string> {
    const email = TRADE_APP_EMAIL?.toString();
    const password = TRADE_APP_PASSWORD?.toString();
    // Extract email and password from the request body
    // Make the axios POST request to send the email and password in the body
    const response = await axios.post(TRADE_APP_URL as string, {
      email, // send the email
      password, // send the password
    });

    return response.data.data.accessToken;
  }

  async createUser(params: {
    username: string;
    firstName: string;
    lastName: string;
    userEmail: string;
    phoneNumber: string;
    password?: string;
    uid?: string;
    profile_photo?: string;
  }): Promise<any> {
    const userRepository = new UserRepository();
    const user = await userRepository.create({
      username: params.username,
      firstName: params.firstName,
      lastName: params.lastName,
      userEmail: params.userEmail,
      phoneNumber: params.phoneNumber,
      password: params.password,
      uid: params.uid,
      profile_photo: params.profile_photo,
    });
    return user;
  }

  async updateuid(params: { userId: string; newUid: number }): Promise<any> {
    console.log(params);
    const userRepository = new UserRepository();
    const user = await userRepository.updateUid({
      id: params.userId,
      newUid: params.newUid,
    });
    return user;
  }

  async updateAllCridents(params: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  }): Promise<any> {
    console.log(params);
    const userRepository = new UserRepository();
    const user = await userRepository.updateAllCridentials({
      id: params.userId,
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      phoneNumber: params.phoneNumber,
    });
    return user;
  }

  async addUserToGroup(params: {
    userId: string;
    targetGroupName: string;
  }): Promise<any> {
    const userRepository = new UserRepository();
    return await userRepository.addUserToGroup({
      userId: params.userId,
      targetGroupName: params.targetGroupName,
    });
  }
}
