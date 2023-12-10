import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdatePartnerLicenseCopyDto {
  @IsBoolean()
  new: boolean;

  @IsString()
  @IsNotEmpty()
  partnerName: string;

  @IsString()
  @IsNotEmpty()
  licenseCopy: string;

  @IsString()
  @IsOptional()
  cloudinaryLicenseCopyURLPublicId: string;
}
