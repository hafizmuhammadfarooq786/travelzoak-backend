import { Injectable } from '@nestjs/common';
import StringUtils from './utils/StringContants';

export type ApiResponseType<T> = SuccessApiResponse<T> | ErrorApiResponse;

export type SuccessApiResponse<T> = {
  code: number;
  status: string;
  message: string;
  data?: T;
};

export type ErrorApiResponse = {
  code: number;
  status: string;
  message: string;
};

export type SeedResponse = {
  code: number;
  status: string;
  message: string;
  data: {
    count: number;
  };
};

@Injectable()
export class ResponseService {
  getSuccessResponse<T>(data?: T): SuccessApiResponse<T> {
    return {
      code: StringUtils.CODE.OK,
      status: StringUtils.STATUS.SUCCESS,
      message: StringUtils.MESSAGE.SUCCESS,
      data,
    };
  }

  getErrorResponse(error: any): ErrorApiResponse {
    return {
      code: StringUtils.CODE.BAD_REQUEST,
      status: StringUtils.STATUS.ERROR,
      message: typeof error === 'string' ? error : JSON.stringify(error),
    };
  }

  getNotFoundResponse(message: string): ErrorApiResponse {
    return {
      code: StringUtils.CODE.NOT_FOUND,
      status: StringUtils.STATUS.NO_RECORD_FOUND,
      message,
    };
  }

  getForbiddenResponse(message: string): ErrorApiResponse {
    return {
      code: StringUtils.CODE.FORBIDDEN,
      status: StringUtils.STATUS.FORBIDDEN,
      message,
    };
  }

  getUnauthorizedResponse(message: string): ErrorApiResponse {
    return {
      code: StringUtils.CODE.UNAUTHORIZED,
      status: StringUtils.STATUS.UNAUTHORIZED,
      message,
    };
  }

  getConflictResponse(message: string): ErrorApiResponse {
    return {
      code: StringUtils.CODE.CONFLICT,
      status: StringUtils.STATUS.CONFLICT,
      message,
    };
  }

  getBadRequestResponse(message: string): ErrorApiResponse {
    return {
      code: StringUtils.CODE.BAD_REQUEST,
      status: StringUtils.STATUS.BAD_REQUEST,
      message,
    };
  }

  getInternalServerResponse(message: string): ErrorApiResponse {
    return {
      code: StringUtils.CODE.INTERNAL_SERVER_ERROR,
      status: StringUtils.STATUS.INTERNAL_SERVER_ERROR,
      message,
    };
  }

  getServiceUnavailableResponse(message: string): ErrorApiResponse {
    return {
      code: StringUtils.CODE.SERVICE_UNAVAILABLE,
      status: StringUtils.STATUS.SERVICE_UNAVAILABLE,
      message,
    };
  }
}
