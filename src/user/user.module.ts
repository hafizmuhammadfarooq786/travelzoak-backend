import { Module } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ResponseService, HelpersService],
})
export class UserModule {}
