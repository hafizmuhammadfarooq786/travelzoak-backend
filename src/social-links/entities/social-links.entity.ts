import { IsString } from 'class-validator';

export class SocialLinks {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  website: string;

  @IsString()
  facebook: string;

  @IsString()
  instagram: string;

  @IsString()
  linkedin: string;

  @IsString()
  youtube: string;

  @IsString()
  tiktok: string;
}
