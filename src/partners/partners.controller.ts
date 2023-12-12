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
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerLicenseCopyDto } from './dto/update-license-copy.dto';
import { UpdatePartnerLogoDto } from './dto/update-partner-logo.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Post()
  async createPartner(@Body() createPartnerDto: CreatePartnerDto) {
    return await this.partnersService.addPartner(createPartnerDto);
  }

  @Public()
  @Get()
  getAllPartners() {
    return this.partnersService.getPartners();
  }

  @Get(':partnerId')
  getPartnerById(@Param('partnerId') partnerId: string) {
    return this.partnersService.getPartnerDetailsById(partnerId);
  }

  @Patch(':partnerId')
  updatePartnerDetails(
    @Param('partnerId') partnerId: string,
    @Body() updatePartnerDto: UpdatePartnerDto,
  ) {
    return this.partnersService.updatePartnerDetails(
      partnerId,
      updatePartnerDto,
    );
  }

  @Patch(':partnerId/logo')
  updatePartnerLogo(
    @Param('partnerId') partnerId: string,
    @Body() updatePartnerLogoDto: UpdatePartnerLogoDto,
  ) {
    return this.partnersService.updatePartnerLogo(
      partnerId,
      updatePartnerLogoDto,
    );
  }

  @Patch(':partnerId/licenseCopy')
  updatePartnerLicenseCopy(
    @Param('partnerId') partnerId: string,
    @Body() updatePartnerLicenseCopyDto: UpdatePartnerLicenseCopyDto,
  ) {
    return this.partnersService.updatePartnerLicenseCopy(
      partnerId,
      updatePartnerLicenseCopyDto,
    );
  }

  @Delete(':id')
  archivePartner(@Param('partnerId') partnerId: string) {
    return this.partnersService.archivePartnerById(partnerId);
  }
}
