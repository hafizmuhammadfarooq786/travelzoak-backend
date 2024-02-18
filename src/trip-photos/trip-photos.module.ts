import { Module } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { TripsService } from 'src/trips/trips.service';
import { TripPhotosController } from './trip-photos.controller';
import { TripPhotosService } from './trip-photos.service';

@Module({
  controllers: [TripPhotosController],
  providers: [
    TripPhotosService,
    PrismaService,
    ResponseService,
    HelpersService,
    ImageUploadsService,
    TripsService,
  ],
})
export class TripPhotosModule {}
