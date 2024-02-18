import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTripDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  startDate: string;

  @IsNotEmpty()
  @IsString()
  endDate: string;

  @IsNotEmpty()
  @IsString()
  startDesitination: string;

  @IsNotEmpty()
  @IsString()
  endDestination: string;

  @IsNotEmpty()
  @IsNumber()
  totalDays: number;

  @IsNotEmpty()
  @IsNumber()
  totalSeats: number;

  @IsNotEmpty()
  @IsNumber()
  bookedSeats: number;

  @IsNotEmpty()
  @IsNumber()
  perPersonCharges: number;

  @IsNotEmpty()
  @IsNumber()
  coupleCharges: number;

  @IsNotEmpty()
  @IsNumber()
  familyCharges: number;

  @IsNotEmpty()
  @IsNumber()
  advancePayment: number;

  @IsNotEmpty()
  @IsNumber()
  roomSharing: number;

  @IsNotEmpty()
  @IsString()
  coverPhoto: string;

  @IsNotEmpty()
  @IsString()
  thumbnailPhoto: string;

  @IsNotEmpty()
  @IsString({ each: true })
  placesIncluded: string[];

  @IsNotEmpty()
  @IsString({ each: true })
  servicesIncluded: string[];

  @IsNotEmpty()
  @IsString({ each: true })
  servicesExcluded: string[];

  @IsNotEmpty()
  @IsString()
  partnerId: string;
}
