import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUserIdDectorator } from 'src/auth/decorators';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Get Current User
  @Get()
  getCurrentUser(@CurrentUserIdDectorator() userId: string) {
    return this.userService.getUser(userId);
  }

  // Get User By Id
  @Get(':userId')
  getUserById(@Param('userId') userId: string) {
    return this.userService.getUser(userId);
  }

  // Update Current User
  @Patch()
  updateCurrentUser(
    @CurrentUserIdDectorator() userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(userId, updateUserDto);
  }

  // Update User By Id
  @Patch(':userId')
  findAndUpdateUserById(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUserById(userId, updateUserDto);
  }
}
