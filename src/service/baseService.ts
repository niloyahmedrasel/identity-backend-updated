
import { AuthService, IPermission } from "./AuthService";
import { ApiError } from "../utils/api.response";

export interface IServiceOptions {
  throwError?: boolean;
  paginate?: boolean;
}

export interface IPaginationRequest {
  page: number;
  length: number;
}

export interface IPaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

export interface IServiceResult {
  data: any;
  pagination?: IPaginationData;
}

export interface ISearchableFields {
  [key: string]: string[];
}

export const DefaultOptionValue: IServiceOptions = {
  throwError: false,
  paginate: false,
}

export class BaseService {

  protected authService?: AuthService;
  protected searchableFields?: ISearchableFields;

  constructor(authService?: AuthService) {
    this.authService = authService;
  }

  permissionCheck(permission: IPermission, options?: IServiceOptions): boolean {
    //return true if no auth service is passed, this means no permission check is required
    if (!this.authService) {
      return true;
    }
    return this.authService.hasPermission(permission, options);
  }

  protected paginationToSkipLimit(page: number, length: number) {
    return { skip: (page - 1) * length, limit: length };
  }

  protected async paginate(repository: any, paginationRequest: IPaginationRequest, filters?: any): Promise<IPaginationData> {
    if (!repository) {
      throw Error('repository is required');
    }
    if (repository.countDocuments === undefined) {
      throw Error(`${repository.constructor.name} does not have a 'countDocuments' method`);
    }
    if (typeof repository.countDocuments !== 'function') {
      throw Error(`${repository.constructor.name}.countDocuments is not a function`);
    }

    const { page, length } = paginationRequest;
    const totalItems = await repository.countDocuments(filters);
    const totalPages = Math.ceil(totalItems / length);
    const currentPage = page;
    const pageSize = length;

    return { currentPage, totalPages, totalItems, pageSize };
  }

  // protected getNonFilterableFields(filters: string[], options: IServiceOptions = DefaultOptionValue): string[] | null {
  //   const nonFilterableFields: string[] = [];

  //   // Helper function to check fields from searchableFields
  //   filters.forEach((filter: string) => {
  //     if (!Object.keys(this.searchableFields ?? {}).includes(filter)) {
  //       nonFilterableFields.push(filter);
  //     }
  //   })

  //   if (options.throwError && nonFilterableFields.length > 0) {
  //     const message = nonFilterableFields.length === 1
  //       ? "Bad format. Field is not filterable: " + nonFilterableFields[0]
  //       : "Fields are not Filterable: " + nonFilterableFields.join(", ");
  //     throw new ApiError({ status: 400, message });
  //   }

  //   return nonFilterableFields.length > 0 ? nonFilterableFields : null;
  // }

  protected getNonFilterableFields(filterWithOperations: ISearchableFields, options: IServiceOptions = DefaultOptionValue): string[] | null {
    const nonFilterableFields: string[] = [];
    const unsupportedOperations: string[] = [];

    // Helper function to check fields and operators from searchableFields
    Object.entries(filterWithOperations).forEach(([field, operators]) => {
      // Check if field exists in searchableFields
      const allowedOperators = this.searchableFields?.[field];

      if (!allowedOperators) {
        // Field is not filterable
        nonFilterableFields.push(field);
      } else {
        // Check for unsupported operations
        operators.forEach((operator) => {
          if (!allowedOperators.includes(operator)) {
            unsupportedOperations.push(`${field} (${operator})`);
          }
        });
      }
    });

    if (options.throwError && (nonFilterableFields.length > 0 || unsupportedOperations.length > 0)) {
      let message = "";

      if (nonFilterableFields.length > 0) {
        message += nonFilterableFields.length === 1
          ? "Bad format. Field is not filterable: " + nonFilterableFields[0]
          : "Fields are not Filterable: " + nonFilterableFields.join(", ");
      }

      if (unsupportedOperations.length > 0) {
        message += (message ? ". " : "") + (unsupportedOperations.length === 1
          ? "Unsupported operation on field: " + unsupportedOperations[0]
          : "Unsupported operations on fields: " + unsupportedOperations.join(", "));
      }

      throw new ApiError({ status: 400, message });
    }

    // Combine both errors into one result
    const allErrors = [...nonFilterableFields, ...unsupportedOperations];

    return allErrors.length > 0 ? allErrors : null;
  }


  static FilterParamsDecoder = (filters: string | undefined): { filterQuery: any, fields: ISearchableFields } => {
    try {
      if (!filters) return { filterQuery: {}, fields: {} };

      const decoded = JSON.parse(filters.replace(/'/g, '"'));
      const usedFields: ISearchableFields = {};

      const processFilters = (filters: any[]) =>
        filters.map(([field, operator, value]: any) => {
          if (!usedFields[field]) {
            usedFields[field] = [];
          }
          // Ensure operators are not duplicated in the usedFields object
          if (!usedFields[field].includes(operator)) {
            usedFields[field].push(operator);
          }
          switch (operator) {
            case 'eq':
              return { [field]: value };
            case 'ne':
              return { [field]: { $ne: value } };
            case 'like':
              return { [field]: { $regex: new RegExp(value, 'i') } };
            case 'gt':
              return { [field]: { $gt: value } };
            case 'lt':
              return { [field]: { $lt: value } };
            case 'gte':
              return { [field]: { $gte: value } };
            case 'lte':
              return { [field]: { $lte: value } };
            default:
              return {}; // In case of unrecognized operators
          }
        });

      const filterQuery = Array.isArray(decoded[0][0])
        ? { $or: decoded.map((group: any[]) => Object.assign({}, ...processFilters(group))) }
        : { $and: processFilters(decoded) };

      return { filterQuery, fields: usedFields };
    } catch (error) {
      console.error(error);
      throw { status: 400, message: "Bad Filter Format" };
    }
  };


}

// run codde if only its main module
if (require.main === module) {

}

// static createWithKAuthContext<T extends BaseService>(
//   this: new () => T,
//   kauthGrant: KauthGrant
// ): T {
//   const serviceInstance = new this();

//   serviceInstance.AuthService = {
//     user: {
//       id: kauthGrant.access_token?.content?.sub || "",
//       username: kauthGrant.access_token?.content?.preferred_username || "",
//       name: kauthGrant.access_token?.content?.name || "",
//       email: kauthGrant.access_token?.content?.email || "",
//       emailVerified:
//         kauthGrant.access_token?.content?.email_verified || false,
//       phone: kauthGrant.access_token?.content?.phone_number || "",
//       phoneVerified:
//         kauthGrant.access_token?.content?.phone_number_verified || false,
//       roles: kauthGrant.access_token?.content?.realm_access?.roles || [],
//       route_role: kauthGrant.route_role,
//       hasPermission(role: {
//         resource?: string;
//         action?: string;
//         domain?: string;
//       }) {
//         return kauthGrant.hasPermission(role);
//       },
//     },
//   };

//   return serviceInstance;
// }