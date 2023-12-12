import { Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/auth/decorators';
import { UserRolesService } from './user-roles.service';

@Controller('userRoles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  // Seed User Roles
  @Post('/seed')
  createManyUserRoles() {
    return this.userRolesService.createUserRolesFromSeed();
  }

  // Get All User Roles
  @Public()
  @Get()
  getAllUserRoles() {
    return this.userRolesService.getUserRoles();
  }
}
