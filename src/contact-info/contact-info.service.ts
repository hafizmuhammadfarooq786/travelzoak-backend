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
import { ContactInfoDto } from './dto/contact-info.dto';
import { ContactInfo } from './entities/contact-info.entity';

@Injectable()
export class ContactInfoService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  // Create User Contact Info
  async addContactInfo(
    userId: string,
    createContactInfoDto: ContactInfoDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const contactInfo = await this.prisma.contactInformation.create({
        data: {
          id: this.helperService.generateUniqueId(),
          userId: userId,
          ...createContactInfoDto,
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_CONTACT_INFO,
      });

      if (!contactInfo) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_CONTACT_INFO,
        );
      }
      return this.responseService.getSuccessResponse(contactInfo);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Find User Contact Info By User Id
  async getContactInfoByUserId(
    userId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const contactInfo = await this.findUserContactInfoById(userId);

      if (!contactInfo) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_CONTACT_INFO,
        );
      }
      return this.responseService.getSuccessResponse(contactInfo);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Update User Contact Info By User Id
  async updateContactInfo(
    userId: string,
    updatedContactInfoDto: ContactInfoDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const updatedContactInfo = await this.prisma.contactInformation.update({
        where: {
          userId,
        },
        data: {
          ...updatedContactInfoDto,
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_CONTACT_INFO,
      });

      if (!updatedContactInfo) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_CONTACT_INFO,
        );
      }
      return this.responseService.getSuccessResponse(updatedContactInfo);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Find user by id and return user Contact Info details
  async findUserContactInfoById(userId: string): Promise<ContactInfo> {
    return await this.prisma.contactInformation
      .findUnique({
        where: { userId },
        select: Constants.SELECT_KEYS_FOR_CONTACT_INFO,
      })
      .then((userContactInfo) => {
        return {
          ...userContactInfo,
        };
      })
      .catch((error) => {
        throw error.message;
      });
  }
}
