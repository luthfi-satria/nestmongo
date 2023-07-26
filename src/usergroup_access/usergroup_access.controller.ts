import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { UsergroupAccessService } from './usergroup_access.service';
import { ResponseStatusCode } from '../response/response.decorator';
import { UserType } from '../hash/guard/user-type.decorator';
import { AuthJwtGuard } from '../auth/auth.decorator';
import { User } from '../auth/auth.decorator';

@Controller('api/access')
export class UsergroupAccessController {
  constructor(private readonly accessService: UsergroupAccessService) {}

  @Get()
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async getAccess(@User() user) {
    return await this.accessService.getAccess(user);
  }

  @Post()
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async create() {
    return await this.accessService.create();
  }

  @Put()
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async update() {
    return await this.accessService.update();
  }

  @Delete()
  @ResponseStatusCode()
  @UserType('admin')
  @AuthJwtGuard()
  async delete() {
    return await this.accessService.delete();
  }
}
