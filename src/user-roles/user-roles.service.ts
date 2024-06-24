import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma.service';
import { ApiResponseType, ResponseService } from 'src/response.service';
import StringUtils from 'src/utils/StringContants';
import { userRoles } from './seed';

@Injectable()
export class UserRolesService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
  ) {}

  // Create User Roles from seed
  async createUserRolesFromSeed(): Promise<ApiResponseType<void>> {
    try {
      const roles = await this.prisma.userRoles.createMany({
        data: userRoles,
        skipDuplicates: true,
      });

      if (!roles) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_USER_ROLES_FROM_SEED,
        );
      }

      return this.responseService.getSuccessResponse(roles);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Get All User Roles
  async getUserRoles(): Promise<ApiResponseType<any>> {
    try {
      const roles = await this.prisma.userRoles.findMany({});

      if (!roles) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_USER_ROLES,
        );
      }

      return this.responseService.getSuccessResponse(roles);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }
}
