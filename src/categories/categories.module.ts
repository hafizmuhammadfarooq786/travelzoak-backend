import { Module } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PrismaService,
    ResponseService,
    HelpersService,
  ],
})
export class CategoriesModule {}
