import { Injectable } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import {
  ErrorApiResponse,
  ResponseService,
  SuccessApiResponse,
} from 'src/response.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringUtils';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerLicenseCopyDto } from './dto/update-license-copy.dto';
import { UpdatePartnerLogoDto } from './dto/update-partner-logo.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';

@Injectable()
export class PartnersService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
    private imageUploadsService: ImageUploadsService,
  ) {}

  // Add new partner
  async addPartner(
    createPartnerDto: CreatePartnerDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
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
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_PARTNERS,
      });

      if (!partner) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_PARTNER,
        );
      }

      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Get all partners
  async getPartners(): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const partners = await this.prisma.partners.findMany({
        select: Constants.SELECT_KEYS_FOR_PARTNERS,
      });

      if (!partners) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_PARTNERS,
        );
      }

      return this.responseService.getSuccessResponse(partners);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Get partner details by id
  async getPartnerDetailsById(
    partnerId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const partner = await this.prisma.partners.findUnique({
        where: {
          id: partnerId,
        },
        select: Constants.SELECT_KEYS_FOR_PARTNERS,
      });

      if (!partner) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INAVLID_PARTNER_ID,
        );
      }

      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Update partner details
  async updatePartnerDetails(
    partnerId: string,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
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
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_PARTNERS,
      });

      if (!partner) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_PARTNER,
        );
      }

      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Update partner logo
  async updatePartnerLogo(
    partnerId: string,
    updatePartnerLogoDto: UpdatePartnerLogoDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
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
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_PARTNERS,
      });

      if (!partner) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_PARTNER,
        );
      }

      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Update partner license copy
  async updatePartnerLicenseCopy(
    partnerId: string,
    updatePartnerLicenseCopyDto: UpdatePartnerLicenseCopyDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
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
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_PARTNERS,
      });

      if (!partner) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_PARTNER,
        );
      }

      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Archive partner by id
  async archivePartnerById(
    partnerId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const partner = await this.prisma.partners.update({
        where: {
          id: partnerId,
        },
        data: {
          isArchived: true,
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_PARTNERS,
      });

      if (!partner) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_ARCHIVE_PARTNER,
        );
      }

      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }
}
