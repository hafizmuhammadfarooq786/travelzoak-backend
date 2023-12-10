import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthCodeDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;
}
