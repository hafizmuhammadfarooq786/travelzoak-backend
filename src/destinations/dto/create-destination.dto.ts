import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateDestinationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  coverPhotoUrl: string;

  @IsString()
  @IsOptional()
  backgroundUrl: string;

  @IsString()
  @IsOptional()
  thumbnailUrl: string;

  @IsString()
  @IsOptional()
  latitude: string;

  @IsString()
  @IsOptional()
  longitude: string;

  @IsString()
  @IsOptional()
  description: string;
}
