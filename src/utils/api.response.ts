import { Response } from 'express';
import { logger } from '../config/logger';


export type PaginationData = {
  request: {
    skip: number;
    limit: number;
  };
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  } | undefined;
};


export class ApiError extends Error {
  status: number;
  errors?: Array<{ field: string; message: string }>;


  constructor(obj: { status: number, message: string, errors?: Array<{ field: string; message: string }> }) {
    super(obj.message);
    this.status = obj.status;
    this.errors = obj.errors;
  }
}


export class ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Array<{ field: string; message: string }>;
  pagination?: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
  metadata?: { [key: string]: any };


  constructor(
    data?: T,
    message?: string,
    errors?: Array<{ field: string; message: string }>,
    pagination?: {
      totalItems: number;
      totalPages: number;
      currentPage: number;
      pageSize: number;
    },
    metadata?: { [key: string]: any }
  ) {
    this.data = data;
    this.message = message;
    this.errors = errors;
    this.pagination = pagination;
    this.metadata = metadata;
  }


  static success<T>(obj: { response: Response, data: T, message: string, pagination?: any, metadata?: any }) {
    const responseData = new ApiResponse<T>(obj.data, obj.message ?? 'Request was successful', undefined, obj.pagination, obj.metadata)
    return obj.response.status(200).json(responseData);
  }
  // static error(obj:{response: Response, message: string, status: number , errors?: Array<{ field: string; message: string }>, metadata?: any, errorIsInstanceOfApiError?: boolean}) {
  //   const status =  obj.errorIsInstanceOfApiError ? obj.status??500 : 500;
  //   const message =  obj.errorIsInstanceOfApiError ? obj.message : 'Internal Server Error';
  //   const responseData = new ApiResponse<any>(undefined, message, obj.errors, undefined, obj.metadata);
  //   return obj.response.status(status).json(responseData);
  // }


  static error<T extends Error>(obj: { response: Response, error: T, metadata?: any }) {
    const errorIsInstanceOfApiError = obj.error instanceof ApiError;
    const status = errorIsInstanceOfApiError ? (obj.error as any).status ?? 500 : 500;
    const message = errorIsInstanceOfApiError ? (obj.error as any).message ?? "Internal Server Error" : 'Internal Server Error';
    const errors = errorIsInstanceOfApiError ? (obj.error as any).errors : undefined;
    const responseData = new ApiResponse<any>(undefined, message, errors, undefined, obj.metadata);


    if (!errorIsInstanceOfApiError) {
      logger.log({ level: 'error', message: obj.error.message, statusCode: status })
    }
    return obj.response.status(status).json(responseData);
  }
}

export function generateMetadata(version: string, service: string = "shared") {
    return { version: version, service: service, time: new Date().toISOString() };
  }
  

