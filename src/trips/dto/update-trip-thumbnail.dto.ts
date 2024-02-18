import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTripThumbnailDto {
  @IsBoolean()
  new: boolean;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  thumbnailImage: string;

  @IsString()
  @IsOptional()
  cloudinaryThumbnailPublicId: string;
}
