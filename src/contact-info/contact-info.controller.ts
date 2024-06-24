import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { CurrentUserIdDectorator } from 'src/auth/decorators';
import LoggerFactory from 'src/helpers/LoggerFactory';
import { ApiResponseType, ResponseService } from 'src/response.service';
import { ContactInfoService } from './contact-info.service';
import { ContactInfoDto } from './dto/contact-info.dto';
import { ContactInfo } from './entities/contact-info.entity';

@Controller('contactInfo')
export class ContactInfoController {
  constructor(
    private readonly contactInfoService: ContactInfoService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async addCurrentUserContactInfo(
    @CurrentUserIdDectorator() userId: string,
    @Body() contactInfoDto: ContactInfoDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const contactInfo: ContactInfo =
        await this.contactInfoService.addCurrentUserContactInfo(
          userId,
          contactInfoDto,
        );
      LoggerFactory.getLogger().debug(
        `CONTACT_INFORMATION: addCurrentUserContactInfo() response=${JSON.stringify(contactInfo)}`,
      );
      return this.responseService.getSuccessResponse(contactInfo);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `CONTACT_INFORMATION: getAllUser() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Get()
  async getCurrentUserContactInfo(
    @CurrentUserIdDectorator() userId: string,
  ): Promise<ApiResponseType<void>> {
    try {
      const contactInfo: ContactInfo =
        await this.contactInfoService.getContactInfoByUserId(userId);
      LoggerFactory.getLogger().debug(
        `CONTACT_INFORMATION: getCurrentUserContactInfo() response=${JSON.stringify(contactInfo)}`,
      );
      return this.responseService.getSuccessResponse(contactInfo);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `CONTACT_INFORMATION: getCurrentUserContactInfo() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch()
  async updateCurrenUserContactInfo(
    @CurrentUserIdDectorator() userId: string,
    @Body() updateContactInfoDto: ContactInfoDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const contactInfo: ContactInfo =
        await this.contactInfoService.updateContactInfo(
          userId,
          updateContactInfoDto,
        );
      LoggerFactory.getLogger().debug(
        `CONTACT_INFORMATION: updateCurrenUserContactInfo() response=${JSON.stringify(contactInfo)}`,
      );
      return this.responseService.getSuccessResponse(contactInfo);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `CONTACT_INFORMATION: updateCurrenUserContactInfo() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }
}
