import { Injectable } from '@nestjs/common';
import { UserSocialLinks } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import StringUtils from 'src/utils/StringContants';
import { SocialLinkDto } from './dto/social-link.dto';
import { SocialMediaLinks } from './entities/social-links.entity';

@Injectable()
export class SocialLinksService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelpersService,
  ) {}

  async addSocialLinks(
    userId: string,
    createSocialLinkDto: SocialLinkDto,
  ): Promise<SocialMediaLinks> {
    const socialLinks: UserSocialLinks =
      await this.prisma.userSocialLinks.create({
        data: {
          id: this.helperService.generateUniqueId(),
          userId: userId,
          ...createSocialLinkDto,
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

    if (!socialLinks) {
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_SOCIAL_LINKS;
    }
    return this.convertPrimaUserSocialLinksToSocialMediaLinks(socialLinks);
  }

  async getSocialLinksByUserId(userId: string): Promise<SocialMediaLinks> {
    const userSocialLinks = await this.prisma.userSocialLinks.findUnique({
      where: { userId },
    });

    if (!userSocialLinks) {
      return null;
    }

    return this.convertPrimaUserSocialLinksToSocialMediaLinks(userSocialLinks);
  }

  async updateSocialLinks(
    userId: string,
    updatedSocialLinkDto: SocialLinkDto,
  ): Promise<SocialMediaLinks> {
    const udatedSocialLinks = await this.prisma.userSocialLinks.update({
      where: {
        userId,
      },
      data: {
        ...updatedSocialLinkDto,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!udatedSocialLinks) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_SOCIAL_LINKS;
    }

    return await this.getSocialLinksByUserId(userId);
  }

  async convertPrimaUserSocialLinksToSocialMediaLinks(
    userSocialLinks: UserSocialLinks,
  ): Promise<SocialMediaLinks> {
    return {
      id: userSocialLinks.id,
      userId: userSocialLinks.userId,
      facebook: userSocialLinks.facebook,
      instagram: userSocialLinks.instagram,
      linkedin: userSocialLinks.linkedin,
      tiktok: userSocialLinks.tiktok,
      youtube: userSocialLinks.youtube,
      website: userSocialLinks.website,
    };
  }
}
