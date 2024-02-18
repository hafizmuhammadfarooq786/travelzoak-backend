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
import { CreateTripPhotoDto } from './dto/create-trip-photo.dto';
import { UpdateTripPhotoDto } from './dto/update-trip-photo.dto';
import { TripPhotosService } from './trip-photos.service';

@Controller('trip-photos')
export class TripPhotosController {
  constructor(private readonly tripPhotosService: TripPhotosService) {}

  @Post('/seed')
  createTripPhotosFromSeed() {
    return this.tripPhotosService.createTripPhotosFromSeed();
  }

  @Post(':tripId')
  async addTripPhotos(
    @Param('tripId') tripId: string,
    @Body() createTripPhotoDto: CreateTripPhotoDto,
  ) {
    return await this.tripPhotosService.addTripPhotos(
      tripId,
      createTripPhotoDto,
    );
  }

  @Public()
  @Get(':tripId')
  getTripPhotosByTripId(@Param('tripId') tripId: string) {
    return this.tripPhotosService.getTripPhotosByTripId(tripId);
  }

  @Patch(':tripId/:publicId')
  updateTripPhotoByTripIdAndPublicId(
    @Param('tripId') tripId: string,
    @Param('publicId') publicId: string,
    @Body() updateTripPhotoDto: UpdateTripPhotoDto,
  ) {
    return this.tripPhotosService.updateTripPhotoByTripIdAndPublicId(
      tripId,
      publicId,
      updateTripPhotoDto,
    );
  }

  @Delete(':tripId')
  deleteTripPhotosByTripId(@Param('tripId') tripId: string) {
    return this.tripPhotosService.deleteTripPhotosByTripId(tripId);
  }

  @Delete(':tripId/:publicId')
  deleteTripPhotoByTripIdAndPublicId(
    @Param('tripId') tripId: string,
    @Param('publicId') publicId: string,
  ) {
    return this.tripPhotosService.deleteTripPhotoByTripIdAndPublicId(
      tripId,
      publicId,
    );
  }
}
