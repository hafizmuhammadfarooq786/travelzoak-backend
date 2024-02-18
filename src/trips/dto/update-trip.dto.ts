import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTripDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;

  @IsOptional()
  @IsString()
  startDesitination: string;

  @IsOptional()
  @IsString()
  endDestination: string;

  @IsOptional()
  @IsNumber()
  totalDays: number;

  @IsOptional()
  @IsNumber()
  totalSeats: number;

  @IsOptional()
  @IsNumber()
  bookedSeats: number;

  @IsOptional()
  @IsNumber()
  perPersonCharges: number;

  @IsOptional()
  @IsNumber()
  coupleCharges: number;

  @IsOptional()
  @IsNumber()
  familyCharges: number;

  @IsOptional()
  @IsNumber()
  advancePayment: number;

  @IsOptional()
  @IsNumber()
  roomSharing: number;

  @IsOptional()
  @IsString({ each: true })
  placesIncluded: string[];

  @IsOptional()
  @IsString({ each: true })
  servicesIncluded: string[];

  @IsOptional()
  @IsString({ each: true })
  servicesExcluded: string[];

  @IsOptional()
  @IsString()
  partnerId: string;
}
