import { Injectable } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import {
  ErrorApiResponse,
  ResponseService,
  SuccessApiResponse,
} from 'src/response.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringUtils';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const DEFAULT_USER: User = {
  id: '',
  fullName: '',
  email: '',
  countryCode: '',
  phoneCountryCode: '',
  phoneNumber: '',
  cnicNumber: '',
  cnicExpiry: '',
  cnicFrontPhotoUrl: '',
  CnicBackCopyUrl: '',
  roleId: '',
};

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  async getUser(id: string) {
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
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      // Update user personal details
      const user = await this.updateUser(userId, updateUserDto);
      // Return user details
      return this.responseService.getSuccessResponse(user);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Find user by id and return user details with selected keys or
  async findUserById(userId: string): Promise<User> {
    return await this.prisma.users
      .findUnique({
        where: { id: userId },
        select: Constants.SELECT_KEYS_FOR_USERS,
      })
      .then((user) => {
        return {
          ...DEFAULT_USER,
          ...user,
        };
      })
      .catch((error) => {
        throw error.message;
      });
  }

  // Update user personal details
  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Find user by id and update user personal details
    const isUpdatedUser = await this.prisma.users.update({
      where: { id },
      data: {
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        ...updateUserDto,
      },
      select: Constants.SELECT_KEYS_FOR_USERS,
    });

    // If user not found, return error response
    if (!isUpdatedUser) {
      throw StringUtils.MESSAGE.USER_NOT_FOUND;
    }

    // Return Updated User in Success Response
    return isUpdatedUser;
  }
}
