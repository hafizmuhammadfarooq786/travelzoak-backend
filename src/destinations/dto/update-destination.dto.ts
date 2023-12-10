import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateDestinationDto {
  @IsString()
  @IsOptional()
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

  @IsBoolean()
  @IsOptional()
  isArchived: boolean;
}
