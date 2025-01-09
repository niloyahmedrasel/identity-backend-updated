import { ApiError } from "../utils/api.response";
import { IServiceOptions } from "./baseService";

export interface IPermission {
  resource?: string;
  action?: string;
  domain?: string;
}

export interface IAuthUser {
  id: string;
  username: string;
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  roles: string[];
}

export interface IAuthRoute {
  permission?: IPermission;
}

export class AuthService {
  private user?: IAuthUser;
  private route?: IAuthRoute;

  constructor() {}

  static createFromTokenContent(
    tokenContent: any,
    route?: IAuthRoute
  ): AuthService {
    
    if (!tokenContent || !tokenContent.sub) {
      throw new Error("Token Malformed");
    }

    const authService = new AuthService();

    authService.user = {
      id: tokenContent.sub || "",
      username: tokenContent.preferred_username || "",
      name: tokenContent.name || "",
      email: tokenContent.email || "",
      emailVerified: tokenContent.email_verified || false,
      phone: tokenContent.phone_number || "",
      phoneVerified: tokenContent.phone_number_verified || false,
      roles: tokenContent.realm_access?.roles || [],
    };

    if (route) {
      authService.route = route;
    }

    return authService;
  }

  getUser() {
    return this.user;
  }

  setRoutePermission(permission: IPermission) {
    this.route = { permission };
  }

  hasPermission(permission: IPermission, options?: IServiceOptions): boolean {
    if (!this.user) {
      return false;
    }

    return AuthService.checkPermission(
      { ...this.route?.permission, ...permission },
      this.user.roles,
      options
    );
  }

  static string2Permission(role: string): IPermission {
    const parts = role.split(/[.-]/);
    const len = parts.length;

    if (len >= 3) {
      const resource = parts.slice(0, len - 2).join(".");
      const action = parts[len - 2];
      const domain = parts[len - 1];
      return { resource, action, domain };
    }

    return { resource: undefined, action: undefined, domain: undefined };
  }

  static checkPermission(
    requiredPermission: IPermission,
    permissionList: string[],
    options: IServiceOptions = { throwError: false }
  ): boolean {
    for (const permission of permissionList) {
      const permissionParts = AuthService.string2Permission(permission);
      if (
        (!requiredPermission.resource ||
          requiredPermission.resource === permissionParts.resource) &&
        (!requiredPermission.action ||
          requiredPermission.action === permissionParts.action) &&
        (!requiredPermission.domain ||
          requiredPermission.domain === permissionParts.domain)
      ) {
        return true;
      }
    }
    if (options.throwError) {
      throw new ApiError({
        status: 403,
        message: `Forbidden - You don't have the required role: ${
          requiredPermission.resource || "any"
        }.${requiredPermission.action || "any"}${
          requiredPermission.domain ? "." + requiredPermission.domain : ""
        }`,
      });
    }
    return false;
  }
}
