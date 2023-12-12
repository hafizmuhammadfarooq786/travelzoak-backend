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
import { DestinationsService } from './destinations.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Controller('destinations')
export class DestinationsController {
  constructor(private readonly destinationsService: DestinationsService) {}

  @Post('/seed')
  async createManyDestinationsFromSeed() {
    return await this.destinationsService.createDestinationsFromSeed();
  }

  @Post()
  async createDestination(@Body() createDestinationDto: CreateDestinationDto) {
    return await this.destinationsService.addNewDestination(
      createDestinationDto,
    );
  }

  @Public()
  @Get()
  async getAllDestinations() {
    return await this.destinationsService.getDestinations();
  }

  @Get(':id')
  async getDestinationById(@Param('id') id: string) {
    return await this.destinationsService.getDestinationById(id);
  }

  @Patch(':id')
  async updateDestination(
    @Param('id') id: string,
    @Body() updateDestinationDto: UpdateDestinationDto,
  ) {
    return await this.destinationsService.updateDestinationById(
      id,
      updateDestinationDto,
    );
  }

  @Delete(':id')
  async deleteDestination(@Param('id') id: string) {
    return await this.destinationsService.removeDestinationById(id);
  }
}
