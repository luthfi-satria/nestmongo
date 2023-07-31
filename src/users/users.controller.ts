import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUsersDto,
  GetUserDetail,
  ListUser,
  UpdateUserDto,
} from './dto/users.dto';
import { ResponseStatusCode } from '../response/response.decorator';
import { UserType } from '../hash/guard/user-type.decorator';
import { AuthJwtGuard } from '../auth/auth.decorator';
import { User } from '../auth/auth.decorator';
import { DBHelper } from '../helper/database.helper';

@Controller('api/user')
@ResponseStatusCode()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @ResponseStatusCode()
  async register(@Body() payload: CreateUsersDto) {
    return this.userService.register(payload);
  }

  @Get()
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async listUser(@Param() param: ListUser) {
    return await this.userService.listUser(param);
  }

  @Get('profile/:id')
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async detail(@Param() user: GetUserDetail) {
    return await this.userService.profile(user.id);
  }

  @Get('profile')
  @ResponseStatusCode()
  @UserType('admin', 'user')
  @AuthJwtGuard()
  async profile(@User() user: any) {
    const id = DBHelper.NewObjectID(user.id);
    return await this.userService.profile(id);
  }

  @Put('profile')
  @UserType('admin', 'user')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async updateProfile(@User() user: any, @Body() body: UpdateUserDto) {
    const userid = DBHelper.NewObjectID(user.id);
    return await this.userService.update(userid, body);
  }

  @Put('profile/:id')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async update(@Param() param: GetUserDetail, @Body() body: UpdateUserDto) {
    return await this.userService.update(param.id, body);
  }
}
