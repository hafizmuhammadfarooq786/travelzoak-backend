import { Module } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { DestinationsController } from './destinations.controller';
import { DestinationsService } from './destinations.service';

@Module({
  controllers: [DestinationsController],
  providers: [
    DestinationsService,
    PrismaService,
    ResponseService,
    HelpersService,
  ],
})
export class DestinationsModule {}
