import { Module } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { TripsController } from './trips.controller';
import { TripsService } from './trips.service';

@Module({
  controllers: [TripsController],
  providers: [
    TripsService,
    ImageUploadsService,
    PrismaService,
    HelpersService,
    ResponseService,
  ],
})
export class TripsModule {}
