import { IsOptional, IsString } from 'class-validator';

export class ContactInfoDto {
  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  postalCode: string;

  @IsString()
  @IsOptional()
  state: string;
}
