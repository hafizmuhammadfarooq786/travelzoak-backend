import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePartnerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsBoolean()
  @IsNotEmpty()
  isLicensed: boolean;

  @IsString()
  @IsOptional()
  licenseNo: string;

  @IsString()
  logoImage: string;

  @IsString()
  @IsOptional()
  licenseCopy: string;

  @IsString()
  @IsOptional()
  cloudinaryLogoPublicId: string;

  @IsString()
  @IsOptional()
  cloudinaryLicenseCopyURLPublicId: string;
}
