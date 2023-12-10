import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUserIdDectorator } from 'src/auth/decorators';
import { SocialLinkDto } from './dto/social-link.dto';
import { SocialLinksService } from './social-links.service';

@Controller('socialLinks')
export class SocialLinksController {
  constructor(private readonly socialLinksService: SocialLinksService) {}

  // Get Current User Social Links
  @Get()
  async getCurrentUserSocialLinks(@CurrentUserIdDectorator() userId: string) {
    return await this.socialLinksService.getSocialLinksByUserId(userId);
  }

  // Get User Social Links By User Id
  @Get(':userId')
  async getUserIdSocialLinks(@Param('userId') userId: string) {
    return await this.socialLinksService.getSocialLinksByUserId(userId);
  }

  // Update Current User Social Links
  @Patch()
  async updateCurrentUserSocialLinks(
    @CurrentUserIdDectorator() userId: string,
    @Body() updateSocialLinkDto: SocialLinkDto,
  ) {
    return await this.socialLinksService.updateSocialLinks(
      userId,
      updateSocialLinkDto,
    );
  }

  // Update User Social Links By User Id
  @Patch(':userId')
  async updateUserSocialLinks(
    @Param('userId') userId: string,
    @Body() updateSocialLinkDto: SocialLinkDto,
  ) {
    return await this.socialLinksService.updateSocialLinks(
      userId,
      updateSocialLinkDto,
    );
  }
}
