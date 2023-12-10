import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import {
  ErrorApiResponse,
  ResponseService,
  SuccessApiResponse,
} from 'src/response.service';
import StringUtils from 'src/utils/StringUtils';
import { userRoles } from './seed';

@Injectable()
export class UserRolesService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
  ) {}

  // Create User Roles from seed
  async createUserRolesFromSeed(): Promise<
    SuccessApiResponse | ErrorApiResponse
  > {
    try {
      const userRole = await this.prisma.userRoles.createMany({
        data: userRoles,
      });

      if (!userRole) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_USER_ROLES_FROM_SEED,
        );
      }

      return this.responseService.getSuccessResponse(userRole);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Get All User Roles
  async getUserRoles(): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const userRoles = await this.prisma.userRoles.findMany({});

      if (!userRoles) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_USER_ROLES,
        );
      }

      return this.responseService.getSuccessResponse(userRoles);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }
}
