import { Injectable } from '@nestjs/common';
import { ContactInformation } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import StringUtils from 'src/utils/StringContants';
import { ContactInfoDto } from './dto/contact-info.dto';
import { ContactInfo } from './entities/contact-info.entity';

@Injectable()
export class ContactInfoService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelpersService,
  ) {}

  async addCurrentUserContactInfo(
    userId: string,
    createContactInfoDto: ContactInfoDto,
  ): Promise<ContactInfo> {
    const contactInfo: ContactInformation =
      await this.prisma.contactInformation.create({
        data: {
          id: this.helperService.generateUniqueId(),
          userId: userId,
          ...createContactInfoDto,
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

    if (!contactInfo) {
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_CONTACT_INFO;
    }
    return this.convertPrimaContactInforToContactInfo(contactInfo);
  }

  async getContactInfoByUserId(userId: string): Promise<ContactInfo> {
    const contactInfo = await this.prisma.contactInformation.findUnique({
      where: { userId },
    });

    if (!contactInfo) {
      return null;
    }

    return this.convertPrimaContactInforToContactInfo(contactInfo);
  }

  async updateContactInfo(
    userId: string,
    updatedContactInfoDto: ContactInfoDto,
  ): Promise<ContactInfo> {
    const updatedContactInfo = await this.prisma.contactInformation.update({
      where: {
        userId,
      },
      data: {
        ...updatedContactInfoDto,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!updatedContactInfo) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_CONTACT_INFO;
    }

    return this.getContactInfoByUserId(updatedContactInfo.id);
  }

  async convertPrimaContactInforToContactInfo(
    information: ContactInformation,
  ): Promise<ContactInfo> {
    return {
      id: information.id,
      userId: information.userId,
      address: information.address,
      city: information.city,
      country: information.country,
      postalCode: information.postalCode,
      state: information.state,
    };
  }
}
