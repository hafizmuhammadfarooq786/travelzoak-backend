import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTripPhotoDto {
  @IsNotEmpty()
  @IsString()
  tripId: string;

  @IsNotEmpty()
  @IsString({ each: true })
  photos: string[];
}
