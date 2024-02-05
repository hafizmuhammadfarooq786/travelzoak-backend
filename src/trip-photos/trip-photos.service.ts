import { Injectable } from '@nestjs/common';
import { CreateTripPhotoDto } from './dto/create-trip-photo.dto';
import { UpdateTripPhotoDto } from './dto/update-trip-photo.dto';

@Injectable()
export class TripPhotosService {
  create(createTripPhotoDto: CreateTripPhotoDto) {
    return 'This action adds a new tripPhoto';
  }

  findAll() {
    return `This action returns all tripPhotos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} tripPhoto`;
  }

  update(id: number, updateTripPhotoDto: UpdateTripPhotoDto) {
    return `This action updates a #${id} tripPhoto`;
  }

  remove(id: number) {
    return `This action removes a #${id} tripPhoto`;
  }
}
