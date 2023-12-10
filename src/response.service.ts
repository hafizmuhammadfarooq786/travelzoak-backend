import { Injectable } from '@nestjs/common';
import StringUtils from './utils/StringUtils';

export type SuccessApiResponse = {
  code: number;
  status: string;
  message: string;
  data?: any;
};

export type ErrorApiResponse = {
  code: number;
  status: string;
  message: string;
};

@Injectable()
export class ResponseService {
  getSuccessResponse(data?: any): SuccessApiResponse {
    return {
      code: StringUtils.CODE.OK,
      status: StringUtils.STATUS.SUCCESS,
      message: StringUtils.MESSAGE.SUCCESS,
      data,
    };
  }

  getErrorResponse(message: any): ErrorApiResponse {
    return {
      code: StringUtils.CODE.BAD_REQUEST,
      status: StringUtils.STATUS.ERROR,
      message,
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
