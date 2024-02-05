import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TripPhotosService } from './trip-photos.service';
import { CreateTripPhotoDto } from './dto/create-trip-photo.dto';
import { UpdateTripPhotoDto } from './dto/update-trip-photo.dto';

@Controller('trip-photos')
export class TripPhotosController {
  constructor(private readonly tripPhotosService: TripPhotosService) {}

  @Post()
  create(@Body() createTripPhotoDto: CreateTripPhotoDto) {
    return this.tripPhotosService.create(createTripPhotoDto);
  }

  @Get()
  findAll() {
    return this.tripPhotosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripPhotosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripPhotoDto: UpdateTripPhotoDto) {
    return this.tripPhotosService.update(+id, updateTripPhotoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripPhotosService.remove(+id);
  }
}
