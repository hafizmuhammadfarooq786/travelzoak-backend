import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUserIdDectorator } from 'src/auth/decorators';
import { ContactInfoService } from './contact-info.service';
import { ContactInfoDto } from './dto/contact-info.dto';

@Controller('contactInfo')
export class ContactInfoController {
  constructor(private readonly contactInfoService: ContactInfoService) {}

  // Get Current User Contact Info
  @Get()
  async getCurrentUserContactInfo(@CurrentUserIdDectorator() userId: string) {
    return await this.contactInfoService.getContactInfoByUserId(userId);
  }

  // Get User Contact Info By User Id
  @Get(':userId')
  async getUserIdContactInfo(@Param('userId') userId: string) {
    return await this.contactInfoService.getContactInfoByUserId(userId);
  }

  // Update Current User Contact Info
  @Patch()
  async updateCurrenUserContactInfo(
    @CurrentUserIdDectorator() userId: string,
    @Body() updateContactInfoDto: ContactInfoDto,
  ) {
    return await this.contactInfoService.updateContactInfo(
      userId,
      updateContactInfoDto,
    );
  }

  // Update User Contact Info By User Id
  @Patch(':userId')
  async updateUserIdContactInfo(
    @Param('userId') userId: string,
    @Body() updateContactInfoDto: ContactInfoDto,
  ) {
    return await this.contactInfoService.updateContactInfo(
      userId,
      updateContactInfoDto,
    );
  }
}
