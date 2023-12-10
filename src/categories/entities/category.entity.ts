import { IsString } from 'class-validator';

export class Category {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  slug: string;
}
