import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { UserRolesController } from './user-roles.controller';
import { UserRolesService } from './user-roles.service';

@Module({
  controllers: [UserRolesController],
  providers: [UserRolesService, PrismaService, ResponseService],
})
export class UserRolesModule {}
