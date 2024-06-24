import { Injectable } from '@nestjs/common';
import { UserRoles, Users } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ApiResponseType, ResponseService } from 'src/response.service';
import StringUtils from 'src/utils/StringContants';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  async createUser(userId: string, email: string): Promise<User> {
    const user: Users = await this.prisma.users.create({
      data: {
        id: userId,
        email,
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!user) {
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_USER;
    }

    return await this.convertPrismaUserToUser(user);
  }

  async getAllUser(): Promise<User[]> {
    const users: Users[] = await this.prisma.users.findMany({});
    if (users.length === 0) {
      return [];
    }
    const results = await Promise.all(
      users.map(async (user) => {
        return await this.convertPrismaUserToUser(user);
      }),
    );

    return results;
  }

  async getUser(id: string): Promise<ApiResponseType<User>> {
    try {
      const findUser = await this.findUserById(id);
      if (!findUser) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INVALID_USER_ID,
        );
      }

      return this.responseService.getSuccessResponse(findUser);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  async updateUserById(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<ApiResponseType<User>> {
    try {
      // Update user personal details
      const user = await this.updateUser(userId, updateUserDto);
      // Return user details
      return this.responseService.getSuccessResponse(user);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Update user personal details
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find user by id and update user personal details
    const userUpdated = await this.prisma.users.update({
      where: { id },
      data: {
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        ...updateUserDto,
      },
    });

    // If user not found, return error response
    if (!userUpdated) {
      throw StringUtils.MESSAGE.USER_NOT_FOUND;
    }

    // Return Updated User in Success Response
    return await this.convertPrismaUserToUser(userUpdated);
  }

  // Find user by id and return user details
  async findUserById(userId: string): Promise<User> {
    return await this.prisma.users
      .findFirst({
        where: { id: userId },
      })
      .then((user) => {
        return this.convertPrismaUserToUser(user);
      })
      .catch((error) => {
        throw error;
      });
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.prisma.users
      .findFirst({
        where: { email },
      })
      .then((user) => {
        return this.convertPrismaUserToUser(user);
      })
      .catch((error) => {
        throw error;
      });
  }

  async convertPrismaUserToUser(user: Users): Promise<User> {
    const userRole = await this.getUserRoleName(user.roleId);
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      countryCode: user.countryCode,
      phoneCountryCode: user.phoneCountryCode,
      phoneNumber: user.phoneNumber,
      cnicNumber: user.cnicNumber,
      cnicExpiry: user.cnicExpiry,
      cnicFrontPhotoUrl: user.cnicFrontPhotoUrl,
      cnicBackCopyUrl: user.cnicBackCopyUrl,
      userRole: userRole,
    };
  }

  async getUserRoleName(id: string): Promise<any> {
    let role: UserRoles = await this.prisma.userRoles.findFirst({
      where: { id },
    });

    if (!role) {
      return null;
    }

    return role;
  }
}
