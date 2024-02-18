import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTripPhotoDto {
  @IsNotEmpty()
  @IsString()
  image: string;
}
