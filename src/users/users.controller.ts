import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto, UpdateUserDto } from './dto/users.dto';
import { ResponseStatusCode } from '../response/response.decorator';
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
  async detail(@Param('id') id) {
    return this.userService.findOne({ id: id });
  }

  @Put(':id')
  @ResponseStatusCode()
  async update(@Param('id') id, @Body() body: UpdateUserDto) {
    return this.userService.update(id, body);
  }
}
