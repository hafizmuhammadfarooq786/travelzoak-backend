import { Controller, Get } from '@nestjs/common';
import { UserRolesService } from './user-roles.service';

@Controller('userRoles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @Get()
  getUserRoles() {
    return this.userRolesService.getUserRoles();
  }
}
