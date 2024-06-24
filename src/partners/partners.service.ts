import { Injectable } from '@nestjs/common';
import { Partners } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringContants';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerLicenseCopyDto } from './dto/update-license-copy.dto';
import { UpdatePartnerLogoDto } from './dto/update-partner-logo.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';

@Injectable()
export class PartnersService {
  constructor(
    private prisma: PrismaService,
    private helperService: HelpersService,
    private imageUploadsService: ImageUploadsService,
  ) {}

  async addPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const logoImageResponse = await this.imageUploadsService.uploadImage(
      createPartnerDto.logoImage,
      Constants.PARTNER_FOLDER_NAME,
      createPartnerDto.name,
    );
    let licenseCopyResponse = {
      imageUrl: '',
      publicId: '',
    };
    if (createPartnerDto.isLicensed) {
      licenseCopyResponse = await this.imageUploadsService.uploadImage(
        createPartnerDto.licenseCopy,
        Constants.PARTNER_FOLDER_NAME,
        createPartnerDto.name,
      );
    }
    const partner = await this.prisma.partners.create({
      data: {
        id: this.helperService.generateUniqueId(),
        name: createPartnerDto.name,
        slug: this.helperService.slugify(createPartnerDto.name),
        logoUrl: logoImageResponse.imageUrl,
        cloudinaryLogoPublicId: logoImageResponse.publicId,
        description: createPartnerDto.description,
        city: createPartnerDto.city,
        state: createPartnerDto.state,
        isLicensed: createPartnerDto.isLicensed,
        licenseNo: createPartnerDto.licenseNo,
        licenseCopyURL: licenseCopyResponse.imageUrl,
        cloudinaryLicenseCopyURLPublicId: licenseCopyResponse.publicId,
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!partner) {
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_PARTNER;
    }

    return this.convertPrismaPartnerToPartner(partner);
  }

  async getPartners(): Promise<Partner[]> {
    const partners = await this.prisma.partners.findMany({});

    if (partners.length === 0) {
      return [];
    }

    const resulst = await Promise.all(
      partners.map(async (partner) => {
        return await this.convertPrismaPartnerToPartner(partner);
      }),
    );

    return resulst;
  }

  async getPartnerDetailsById(partnerId: string): Promise<Partner> {
    const partner = await this.prisma.partners.findUnique({
      where: {
        id: partnerId,
      },
    });

    if (!partner) {
      throw StringUtils.MESSAGE.INAVLID_PARTNER_ID;
    }

    return this.convertPrismaPartnerToPartner(partner);
  }

  async updatePartnerById(
    partnerId: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    if (updatePartnerDto.name) {
      updatePartnerDto['slug'] = this.helperService.slugify(
        updatePartnerDto.name,
      );
    }

    const partner = await this.prisma.partners.update({
      where: {
        id: partnerId,
      },
      data: {
        ...updatePartnerDto,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!partner) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_PARTNER;
    }

    return this.convertPrismaPartnerToPartner(partner);
  }

  async updatePartnerLogo(
    partnerId: string,
    updatePartnerLogoDto: UpdatePartnerLogoDto,
  ): Promise<Partner> {
    const updatedData = {};
    if (updatePartnerLogoDto.new) {
      const logoImageResponse = await this.imageUploadsService.uploadImage(
        updatePartnerLogoDto.logoImage,
        Constants.PARTNER_FOLDER_NAME,
        updatePartnerLogoDto.partnerName,
      );
      updatedData['logoUrl'] = logoImageResponse.imageUrl;
      updatedData['cloudinaryLogoPublicId'] = logoImageResponse.publicId;
    } else {
      const logoURL = await this.imageUploadsService.replaceImage(
        updatePartnerLogoDto.logoImage,
        Constants.PARTNER_FOLDER_NAME,
        updatePartnerLogoDto.cloudinaryLogoPublicId,
      );
      updatedData['logoUrl'] = logoURL;
    }

    const partner = await this.prisma.partners.update({
      where: {
        id: partnerId,
      },
      data: {
        ...updatedData,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!partner) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_PARTNER;
    }

    return this.convertPrismaPartnerToPartner(partner);
  }

  async updatePartnerLicenseCopy(
    partnerId: string,
    updatePartnerLicenseCopyDto: UpdatePartnerLicenseCopyDto,
  ): Promise<Partner> {
    const updatedData = { isLicensed: true };
    if (updatePartnerLicenseCopyDto.new) {
      const logoImageResponse = await this.imageUploadsService.uploadImage(
        updatePartnerLicenseCopyDto.licenseCopy,
        Constants.PARTNER_FOLDER_NAME,
        updatePartnerLicenseCopyDto.partnerName,
      );
      updatedData['licenseCopyURL'] = logoImageResponse.imageUrl;
      updatedData['cloudinaryLicenseCopyURLPublicId'] =
        logoImageResponse.publicId;
    } else {
      const logoURL = await this.imageUploadsService.replaceImage(
        updatePartnerLicenseCopyDto.licenseCopy,
        Constants.PARTNER_FOLDER_NAME,
        updatePartnerLicenseCopyDto.cloudinaryLicenseCopyURLPublicId,
      );
      updatedData['licenseCopyURL'] = logoURL;
    }

    const partner = await this.prisma.partners.update({
      where: {
        id: partnerId,
      },
      data: {
        ...updatedData,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!partner) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_PARTNER;
    }

    return this.convertPrismaPartnerToPartner(partner);
  }

  async deletePartnerById(partnerId: string): Promise<boolean> {
    const partner = await this.prisma.partners.update({
      where: {
        id: partnerId,
      },
      data: {
        isArchived: true,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!partner) {
      throw StringUtils.MESSAGE.FAILED_TO_ARCHIVE_PARTNER;
    }

    return true;
  }

  async convertPrismaPartnerToPartner(partner: Partners): Promise<Partner> {
    return {
      id: partner.id,
      name: partner.name,
      slug: partner.slug,
      description: partner.description,
      logoUrl: partner.logoUrl,
      city: partner.city,
      state: partner.state,
      isLicensed: partner.isLicensed,
      licenseNo: partner.licenseNo,
      licenseCopyURL: partner.licenseCopyURL,
      cloudinaryLogoPublicId: partner.cloudinaryLogoPublicId,
      cloudinaryLicenseCopyURLPublicId:
        partner.cloudinaryLicenseCopyURLPublicId,
    };
  }
}
