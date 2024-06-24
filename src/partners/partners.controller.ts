import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators';
import LoggerFactory from 'src/helpers/LoggerFactory';
import { ApiResponseType, ResponseService } from 'src/response.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerLicenseCopyDto } from './dto/update-license-copy.dto';
import { UpdatePartnerLogoDto } from './dto/update-partner-logo.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { Partner } from './entities/partner.entity';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(
    private readonly partnersService: PartnersService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async addPartner(
    @Body() createPartnerDto: CreatePartnerDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const partner: Partner =
        await this.partnersService.addPartner(createPartnerDto);
      LoggerFactory.getLogger().debug(
        `PARTNERS: addPartner() response=${JSON.stringify(partner)}`,
      );
      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      LoggerFactory.getLogger().error(`PARTNERS: addPartner() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Public()
  @Get()
  async getPartners(): Promise<ApiResponseType<void>> {
    try {
      const partners: Partner[] = await this.partnersService.getPartners();
      LoggerFactory.getLogger().debug(
        `PARTNERS: getPartners() response=${JSON.stringify(partners)}`,
      );
      return this.responseService.getSuccessResponse(partners);
    } catch (error) {
      LoggerFactory.getLogger().error(`PARTNERS: getPartners() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Get(':id')
  async getPartnerById(
    @Param('id') id: string,
  ): Promise<ApiResponseType<void>> {
    try {
      const partner: Partner =
        await this.partnersService.getPartnerDetailsById(id);
      LoggerFactory.getLogger().debug(
        `PARTNERS: getPartnerById() response=${JSON.stringify(partner)}`,
      );
      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `PARTNERS: getPartnerById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':id')
  async updatePartnerById(
    @Param('id') id: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const partner: Partner = await this.partnersService.updatePartnerById(
        id,
        updatePartnerDto,
      );
      LoggerFactory.getLogger().debug(
        `PARTNERS: updatePartnerById() response=${JSON.stringify(partner)}`,
      );
      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `PARTNERS: updatePartnerById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':id/logo')
  async updatePartnerLogo(
    @Param('id') id: string,
    @Body() updatePartnerLogoDto: UpdatePartnerLogoDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const partner: Partner = await this.partnersService.updatePartnerLogo(
        id,
        updatePartnerLogoDto,
      );
      LoggerFactory.getLogger().debug(
        `PARTNERS: updatePartnerLogo() response=${JSON.stringify(partner)}`,
      );
      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `PARTNERS: updatePartnerLogo() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':id/licenseCopy')
  async updatePartnerLicenseCopy(
    @Param('id') id: string,
    @Body() updatePartnerLicenseCopyDto: UpdatePartnerLicenseCopyDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const partner: Partner =
        await this.partnersService.updatePartnerLicenseCopy(
          id,
          updatePartnerLicenseCopyDto,
        );
      LoggerFactory.getLogger().debug(
        `PARTNERS: updatePartnerLicenseCopy() response=${JSON.stringify(partner)}`,
      );
      return this.responseService.getSuccessResponse(partner);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `PARTNERS: updatePartnerLicenseCopy() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Delete(':id')
  async deletePartnerById(
    @Param('id') id: string,
  ): Promise<ApiResponseType<void>> {
    try {
      await this.partnersService.deletePartnerById(id);
      return this.responseService.getSuccessResponse();
    } catch (error) {
      LoggerFactory.getLogger().error(
        `PARTNERS: deletePartnerById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }
}
