import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateTripCoverDto {
  @IsBoolean()
  new: boolean;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsNotEmpty()
  coverImage: string;

  @IsString()
  @IsOptional()
  cloudinaryCoverPublicId: string;
}
