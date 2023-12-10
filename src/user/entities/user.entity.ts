import { IsString } from 'class-validator';

export class User {
  @IsString()
  id: string;

  @IsString()
  fullName: string;

  @IsString()
  email: string;

  @IsString()
  countryCode: string;

  @IsString()
  phoneCountryCode: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  cnicNumber: string;

  @IsString()
  cnicExpiry: string;

  @IsString()
  cnicFrontPhotoUrl: string;

  @IsString()
  CnicBackCopyUrl: string;

  @IsString()
  roleId: string;
}
