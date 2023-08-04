import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { AppconfigService } from './appconfig.service';
import { UserType } from '../hash/guard/user-type.decorator';
import { AuthJwtGuard } from '../auth/auth.decorator';
import { ResponseStatusCode } from '../response/response.decorator';
import {
  AppconfigDto,
  GetAppconfigID,
  ListAppconfig,
} from './dto/appconfig.dto';
import { DBHelper } from '../helper/database.helper';

@Controller('api/configuration')
export class AppconfigController {
  constructor(private readonly appconfigService: AppconfigService) {}

  @Get('')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async findAll(@Query() param: ListAppconfig) {
    return await this.appconfigService.listConfig(param);
  }

  @Put('')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async update(@Param() param: GetAppconfigID, @Body() body: AppconfigDto) {
    const userid = DBHelper.NewObjectID(param.id);
    return await this.appconfigService.update(userid, body);
  }
}
