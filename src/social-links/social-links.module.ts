import { Module } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { SocialLinksController } from './social-links.controller';
import { SocialLinksService } from './social-links.service';

@Module({
  controllers: [SocialLinksController],
  providers: [
    SocialLinksService,
    PrismaService,
    ResponseService,
    HelpersService,
  ],
})
export class SocialLinksModule {}
