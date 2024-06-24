import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CurrentUserIdDectorator } from 'src/auth/decorators';
import LoggerFactory from 'src/helpers/LoggerFactory';
import { ApiResponseType, ResponseService } from 'src/response.service';
import { SocialLinkDto } from './dto/social-link.dto';
import { SocialMediaLinks } from './entities/social-links.entity';
import { SocialLinksService } from './social-links.service';

@Controller('socialLinks')
export class SocialLinksController {
  constructor(
    private readonly socialLinksService: SocialLinksService,
    private responseService: ResponseService,
  ) {}

  @Post()
  async addCurrentUserSocialLinks(
    @CurrentUserIdDectorator() userId: string,
    @Body() socialLinkDto: SocialLinkDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const socialLinks: SocialMediaLinks =
        await this.socialLinksService.addSocialLinks(userId, socialLinkDto);
      LoggerFactory.getLogger().debug(
        `SOCIAL_LINKS: addSocialLinks() response=${JSON.stringify(socialLinks)}`,
      );
      return this.responseService.getSuccessResponse(socialLinks);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `SOCIAL_LINKS: getAllUser() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Get()
  async getCurrentUserSocialLinks(
    @CurrentUserIdDectorator() userId: string,
  ): Promise<ApiResponseType<void>> {
    try {
      const socialLinks: SocialMediaLinks =
        await this.socialLinksService.getSocialLinksByUserId(userId);
      LoggerFactory.getLogger().debug(
        `SOCIAL_LINKS: getCurrentUserSocialLinks() response=${JSON.stringify(socialLinks)}`,
      );
      return this.responseService.getSuccessResponse(socialLinks);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `SOCIAL_LINKS: getCurrentUserSocialLinks() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch()
  async updateCurrenUserSocialLinks(
    @CurrentUserIdDectorator() userId: string,
    @Body() socialLinkDto: SocialLinkDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const socialLinks: SocialMediaLinks =
        await this.socialLinksService.updateSocialLinks(userId, socialLinkDto);
      LoggerFactory.getLogger().debug(
        `SOCIAL_LINKS: updateCurrenUserSocialLinks() response=${JSON.stringify(socialLinks)}`,
      );
      return this.responseService.getSuccessResponse(socialLinks);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `SOCIAL_LINKS: updateCurrenUserSocialLinks() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }
}
