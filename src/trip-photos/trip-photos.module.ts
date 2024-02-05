import { Module } from '@nestjs/common';
import { TripPhotosService } from './trip-photos.service';
import { TripPhotosController } from './trip-photos.controller';

@Module({
  controllers: [TripPhotosController],
  providers: [TripPhotosService],
})
export class TripPhotosModule {}
