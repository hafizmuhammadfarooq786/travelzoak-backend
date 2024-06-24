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
import { CreateTripPhotoDto } from './dto/create-trip-photo.dto';
import { UpdateTripPhotoDto } from './dto/update-trip-photo.dto';
import { TripPhoto } from './entities/trip-photo.entity';
import { TripPhotosService } from './trip-photos.service';

@Controller('tripPhotos')
export class TripPhotosController {
  constructor(
    private readonly tripPhotosService: TripPhotosService,
    private readonly responseService: ResponseService,
  ) {}

  @Post(':id')
  async addTripPhotos(
    @Param('id') tripId: string,
    @Body() createTripPhotoDto: CreateTripPhotoDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const tripPhoto: TripPhoto =
        await await this.tripPhotosService.addTripPhotos(
          tripId,
          createTripPhotoDto,
        );
      LoggerFactory.getLogger().debug(
        `TRIP_PHOTOS: addTripPhotos() response=${JSON.stringify(tripPhoto)}`,
      );
      return this.responseService.getSuccessResponse(tripPhoto);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `TRIP_PHOTOS: addTripPhotos() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Public()
  @Get(':id')
  async getTripPhotosByTripId(
    @Param('id') tripId: string,
  ): Promise<ApiResponseType<void>> {
    try {
      const tripPhotos: TripPhoto =
        await this.tripPhotosService.getTripPhotosByTripId(tripId);
      LoggerFactory.getLogger().debug(
        `TRIP_PHOTOS: getTripPhotosByTripId() response=${JSON.stringify(tripPhotos)}`,
      );
      return this.responseService.getSuccessResponse(tripPhotos);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `TRIP_PHOTOS: getTripPhotosByTripId() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':id/:publicId')
  async updateTripPhotoByTripIdAndPublicId(
    @Param('id') tripId: string,
    @Param('publicId') publicId: string,
    @Body() updateTripPhotoDto: UpdateTripPhotoDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const tripPhoto: TripPhoto =
        await this.tripPhotosService.updateTripPhotoByTripIdAndPublicId(
          tripId,
          publicId,
          updateTripPhotoDto,
        );
      LoggerFactory.getLogger().debug(
        `TRIP_PHOTOS: updateTripPhotoByTripIdAndPublicId() response=${JSON.stringify(tripPhoto)}`,
      );
      return this.responseService.getSuccessResponse(tripPhoto);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `TRIP_PHOTOS: updateTripPhotoByTripIdAndPublicId() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Delete(':id')
  async deleteTripPhotosByTripId(
    @Param('id') tripId: string,
  ): Promise<ApiResponseType<void>> {
    try {
      await this.tripPhotosService.deleteTripPhotosByTripId(tripId);
      return this.responseService.getSuccessResponse();
    } catch (error) {
      LoggerFactory.getLogger().error(
        `TRIP_PHOTOS: deleteTripPhotosByTripId() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Delete(':id/photos')
  async deleteTripPhotoByTripIdAndPublicId(
    @Param('id') tripId: string,
    @Body('publicIds') publicId: string[],
  ): Promise<ApiResponseType<void>> {
    try {
      await this.tripPhotosService.deleteTripPhotoByTripIdAndPublicId(
        tripId,
        publicId,
      );

      return this.responseService.getSuccessResponse();
    } catch (error) {
      LoggerFactory.getLogger().error(
        `TRIP_PHOTOS: deleteTripPhotoByTripIdAndPublicId() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }
}
