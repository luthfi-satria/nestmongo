import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto, GetUserDetail, UpdateUserDto } from './dto/users.dto';
import { ResponseStatusCode } from '../response/response.decorator';
import { UserType } from '../hash/guard/user-type.decorator';
import { AuthJwtGuard } from '../auth/auth.decorator';
import { User } from '../auth/auth.decorator';
import { DBHelper } from '../helper/database.helper';
// import { AuthJwtGuard } from 'src/auth/auth.decorator';
// import { UserType } from 'src/hash/guard/user-type.decorator';

@Controller('api/user')
@ResponseStatusCode()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @ResponseStatusCode()
  async register(@Body() payload: CreateUsersDto) {
    return this.userService.register(payload);
  }

  @Get(':id')
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async detail(@Param() user: GetUserDetail) {
    return this.userService.findOne({ _id: user.id });
  }

  @Get('')
  @ResponseStatusCode()
  @UserType('admin', 'user')
  @AuthJwtGuard()
  async profile(@User() user: any) {
    const id = DBHelper.NewObjectID(user.id);
    return this.userService.findOne({ _id: id });
  }

  @Put(':id')
  @UserType('admin', 'user')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async update(@Param('id') id, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }
}
