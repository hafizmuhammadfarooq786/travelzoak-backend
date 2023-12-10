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
import { SocialLinkDto } from './dto/social-link.dto';
import { SocialLinks } from './entities/social-links.entity';

@Injectable()
export class SocialLinksService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  // Create User Social Links
  async addSocialLinks(
    userId: string,
    createSocialLinkDto: SocialLinkDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const socialLinks = await this.prisma.userSocialLinks.create({
        data: {
          id: this.helperService.generateUniqueId(),
          userId: userId,
          ...createSocialLinkDto,
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_SOCIAL_LINKS,
      });

      if (!socialLinks) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_SOCIAL_LINKS,
        );
      }
      return this.responseService.getSuccessResponse(socialLinks);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Get User Social Links By User Id
  async getSocialLinksByUserId(
    userId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const userSocialLinks = await this.findUserSocialLinksById(userId);
      if (!userSocialLinks) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_SOCIAL_LINKS,
        );
      }
      return this.responseService.getSuccessResponse(userSocialLinks);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Update User Social Links By User Id
  async updateSocialLinks(
    userId: string,
    updatedSocialLinkDto: SocialLinkDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const udatedSocialLinks = await this.prisma.userSocialLinks.update({
        where: {
          userId,
        },
        data: {
          ...updatedSocialLinkDto,
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_SOCIAL_LINKS,
      });

      if (!udatedSocialLinks) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_SOCIAL_LINKS,
        );
      }
      return this.responseService.getSuccessResponse(udatedSocialLinks);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Find user by id and return user social link details
  async findUserSocialLinksById(userId: string): Promise<SocialLinks> {
    return await this.prisma.userSocialLinks
      .findUnique({
        where: { userId },
        select: Constants.SELECT_KEYS_FOR_SOCIAL_LINKS,
      })
      .then((userSocialLinks) => {
        return {
          ...userSocialLinks,
        };
      })
      .catch((error) => {
        throw error.message;
      });
  }
}
