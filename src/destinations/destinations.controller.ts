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
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from './entities/destination.entity';

@Controller('destinations')
export class DestinationsController {
  constructor(
    private readonly destinationsService: DestinationsService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async addDestination(
    @Body() createDestinationDto: CreateDestinationDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const destination: Destination =
        await this.destinationsService.addDestination(createDestinationDto);
      LoggerFactory.getLogger().debug(
        `DESTINATIONS: addDestination() response=${JSON.stringify(destination)}`,
      );
      return this.responseService.getSuccessResponse(destination);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `DESTINATIONS: addDestination() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Public()
  @Get()
  async getDestinations(): Promise<ApiResponseType<void>> {
    try {
      const destinations: Destination[] =
        await this.destinationsService.getDestinations();
      LoggerFactory.getLogger().debug(
        `DESTINATIONS: getDestinations() response=${JSON.stringify(destinations)}`,
      );
      return this.responseService.getSuccessResponse(destinations);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `DESTINATIONS: getDestinations() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Get(':id')
  async getDestinationById(
    @Param('id') id: string,
  ): Promise<ApiResponseType<void>> {
    try {
      const destination: Destination =
        await this.destinationsService.getDestinationById(id);
      LoggerFactory.getLogger().debug(
        `DESTINATIONS: getDestinationById() response=${JSON.stringify(destination)}`,
      );
      return this.responseService.getSuccessResponse(destination);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `DESTINATIONS: getDestinationById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':id')
  async updateDestinationById(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const destination: Destination =
        await this.destinationsService.updateDestinationById(
          id,
          updateDestinationDto,
        );
      LoggerFactory.getLogger().debug(
        `DESTINATIONS: updateDestinationById() response=${JSON.stringify(destination)}`,
      );
      return this.responseService.getSuccessResponse(destination);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `DESTINATIONS: updateDestinationById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Delete(':id')
  async deleteDestinationById(
    @Param('id') id: string,
  ): Promise<ApiResponseType<void>> {
    try {
      await this.destinationsService.deleteDestinationById(id);
      return this.responseService.getSuccessResponse();
    } catch (error) {
      LoggerFactory.getLogger().error(
        `DESTINATIONS: deleteDestinationById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }
}
