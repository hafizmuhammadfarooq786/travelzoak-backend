import { IsString } from 'class-validator';

export class ContactInfo {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  country: string;

  @IsString()
  postalCode: string;

  @IsString()
  state: string;
}
