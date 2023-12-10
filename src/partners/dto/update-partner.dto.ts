import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePartnerDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsBoolean()
  @IsOptional()
  isLicensed: boolean;

  @IsString()
  @IsOptional()
  licenseNo: string;
}
