import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  HttpStatus,
  Query,
} from '@nestjs/common';
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
import { Types } from 'mongoose';
import { ResponseService } from '../response/response.service';

@Controller('api/user')
@ResponseStatusCode()
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly responseService: ResponseService,
  ) {}

  @Post('register')
  @ResponseStatusCode()
  async register(@Body() payload: CreateUsersDto) {
    return this.userService.register(payload);
  }

  @Get()
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async listUser(@Query() param: ListUser) {
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
    if (Types.ObjectId.isValid(param.id) == false) {
      return this.responseService.error(HttpStatus.BAD_REQUEST, {
        value: param.id,
        property: 'id',
        constraint: ['invalid id format'],
      });
    }
    return await this.userService.update(param.id, body);
  }
}
