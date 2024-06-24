import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import LoggerFactory from 'src/helpers/LoggerFactory';
import { ApiResponseType, ResponseService } from 'src/response.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
  ) {}

  @Get()
  async getAllUser(): Promise<ApiResponseType<User[]>> {
    try {
      const users = await this.userService.getAllUser();
      LoggerFactory.getLogger().debug(
        `USERS: getAllUser() success response=${JSON.stringify(users)}`,
      );
      return this.responseService.getSuccessResponse(users);
    } catch (error) {
      LoggerFactory.getLogger().error(`USERS: getAllUser() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.userService.getUser(id);
  }

  @Patch(':id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateUserById(id, updateUserDto);
  }
}
