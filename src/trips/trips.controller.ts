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
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripCoverDto } from './dto/update-trip-cover.dto';
import { UpdateTripThumbnailDto } from './dto/update-trip-thumbnail.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TravelzoakTrip } from './entities/trip.entity';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(
    private readonly tripsService: TripsService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async addTrip(
    @Body() createTripDto: CreateTripDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const trip: TravelzoakTrip =
        await this.tripsService.addTrip(createTripDto);
      LoggerFactory.getLogger().debug(
        `TRIPS: addTrip() success response=${JSON.stringify(trip)}`,
      );
      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      LoggerFactory.getLogger().error(`TRIPS: addTrip() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Public()
  @Get()
  async getTrips(): Promise<ApiResponseType<void>> {
    try {
      const trips: TravelzoakTrip[] = await this.tripsService.getTrips();
      LoggerFactory.getLogger().debug(
        `TRIPS: getTrips() success response=${JSON.stringify(trips)}`,
      );
      return this.responseService.getSuccessResponse(trips);
    } catch (error) {
      LoggerFactory.getLogger().error(`TRIPS: getTrips() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Public()
  @Get(':tripId')
  async getTripById(
    @Param('tripId') tripId: string,
  ): Promise<ApiResponseType<void>> {
    try {
      const trip: TravelzoakTrip = await this.tripsService.getTripById(tripId);
      LoggerFactory.getLogger().debug(
        `TRIPS: getTripById() success response=${JSON.stringify(trip)}`,
      );
      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      LoggerFactory.getLogger().error(`TRIPS: getTripById() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':tripId')
  async updateTripById(
    @Param('tripId') tripId: string,
    @Body() updateTripDto: UpdateTripDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const trip: TravelzoakTrip = await this.tripsService.updateTripById(
        tripId,
        updateTripDto,
      );
      LoggerFactory.getLogger().debug(
        `TRIPS: updateTripById() success response=${JSON.stringify(trip)}`,
      );
      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      LoggerFactory.getLogger().error(`TRIPS: updateTripById() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':tripId/cover')
  async updateTripCover(
    @Param('tripId') tripId: string,
    @Body() updateTripCoverDto: UpdateTripCoverDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const trip: TravelzoakTrip = await this.tripsService.updateTripCover(
        tripId,
        updateTripCoverDto,
      );
      LoggerFactory.getLogger().debug(
        `TRIPS: updateTripCover() success response=${JSON.stringify(trip)}`,
      );
      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `TRIPS: updateTripCover() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':tripId/thumbnail')
  async updateTripThumbnail(
    @Param('tripId') tripId: string,
    @Body() updateTripThumbnailDto: UpdateTripThumbnailDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const trip: TravelzoakTrip = await this.tripsService.updateTripThumbnail(
        tripId,
        updateTripThumbnailDto,
      );
      LoggerFactory.getLogger().debug(
        `TRIPS: updateTripThumbnail() success response=${JSON.stringify(trip)}`,
      );
      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `TRIPS: updateTripThumbnail() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Delete(':id')
  async deleteTripById(
    @Param('tripId') tripId: string,
  ): Promise<ApiResponseType<void>> {
    try {
      await this.tripsService.deleteTripById(tripId);
      return this.responseService.getSuccessResponse();
    } catch (error) {
      LoggerFactory.getLogger().error(`TRIPS: getTripById() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }
}
