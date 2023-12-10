import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  countryCode: string;

  @IsString()
  @IsOptional()
  phoneCountryCode: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  cnicNumber: string;

  @IsString()
  @IsOptional()
  cnicExpiry: string;

  @IsString()
  @IsOptional()
  cnicFrontPhotoUrl: string;

  @IsString()
  @IsOptional()
  CnicBackCopyUrl: string;
}
