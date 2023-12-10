import { IsOptional, IsString } from 'class-validator';

export class SocialLinkDto {
  @IsString()
  @IsOptional()
  website: string;

  @IsString()
  @IsOptional()
  facebook: string;

  @IsString()
  @IsOptional()
  instagram: string;

  @IsString()
  @IsOptional()
  linkedin: string;

  @IsString()
  @IsOptional()
  youtube: string;

  @IsString()
  @IsOptional()
  tiktok: string;
}
