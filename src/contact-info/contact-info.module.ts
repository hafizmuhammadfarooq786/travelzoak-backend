import { Module } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { ContactInfoController } from './contact-info.controller';
import { ContactInfoService } from './contact-info.service';

@Module({
  controllers: [ContactInfoController],
  providers: [
    ContactInfoService,
    PrismaService,
    ResponseService,
    HelpersService,
  ],
})
export class ContactInfoModule {}
