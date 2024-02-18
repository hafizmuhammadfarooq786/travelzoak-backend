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
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripCoverDto } from './dto/update-trip-cover.dto';
import { UpdateTripThumbnailDto } from './dto/update-trip-thumbnail.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('/seed')
  createTripsFromSeed() {
    return this.tripsService.createTripsFromSeed();
  }

  @Post()
  async addTrip(@Body() createTripDto: CreateTripDto) {
    return await this.tripsService.addTrip(createTripDto);
  }

  @Public()
  @Get()
  getAllTrips() {
    return this.tripsService.getTrips();
  }

  @Public()
  @Get(':tripId')
  getTripById(@Param('tripId') tripId: string) {
    return this.tripsService.getTripDetailsById(tripId);
  }

  @Patch(':tripId')
  updateTripDetailsById(
    @Param('tripId') tripId: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.updateTripDetailsById(tripId, updateTripDto);
  }

  @Patch(':tripId/cover')
  updateTripCover(
    @Param('tripId') tripId: string,
    @Body() updateTripCoverDto: UpdateTripCoverDto,
  ) {
    return this.tripsService.updateTripCover(tripId, updateTripCoverDto);
  }

  @Patch(':tripId/thumbnail')
  updateTripThumbnail(
    @Param('tripId') tripId: string,
    @Body() updateTripThumbnailDto: UpdateTripThumbnailDto,
  ) {
    return this.tripsService.updateTripThumbnail(
      tripId,
      updateTripThumbnailDto,
    );
  }

  @Delete(':id')
  deleteTripById(@Param('tripId') tripId: string) {
    return this.tripsService.deleteTripById(tripId);
  }
}
