import { PartialType } from '@nestjs/mapped-types';
import { CreateTripPhotoDto } from './create-trip-photo.dto';

export class UpdateTripPhotoDto extends PartialType(CreateTripPhotoDto) {}
