import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePartnerLogoDto {
  @IsBoolean()
  new: boolean;

  @IsString()
  @IsNotEmpty()
  partnerName: string;

  @IsString()
  @IsNotEmpty()
  logoImage: string;

  @IsString()
  @IsOptional()
  cloudinaryLogoPublicId: string;
}
