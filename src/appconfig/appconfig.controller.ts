import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AppconfigService } from './appconfig.service';
import { UserType } from '../hash/guard/user-type.decorator';
import { AuthJwtGuard } from '../auth/auth.decorator';
import { ResponseStatusCode } from '../response/response.decorator';
import {
  AppconfigDto,
  GetAppconfigID,
  ListAppconfig,
} from './dto/appconfig.dto';
import { Types } from 'mongoose';
import { ResponseService } from '../response/response.service';

@Controller('api/configuration')
export class AppconfigController {
  constructor(
    private readonly appconfigService: AppconfigService,
    private readonly responseService: ResponseService,
  ) {}

  @Get('')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async findAll(@Query() param: ListAppconfig) {
    return await this.appconfigService.listConfig(param);
  }

  @Get('/:id')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async getDetail(@Param() param: GetAppconfigID) {
    return await this.appconfigService.getDetailConfig(param.id);
  }

  @Put(':id')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async update(@Param() param: GetAppconfigID, @Body() body: AppconfigDto) {
    if (Types.ObjectId.isValid(param.id) == false) {
      return this.responseService.error(HttpStatus.BAD_REQUEST, {
        value: param.id,
        property: 'id',
        constraint: ['invalid id format'],
      });
    }
    return await this.appconfigService.update(param.id, body);
  }

  @Post('forcesync')
  @UserType('admin')
  @AuthJwtGuard()
  @ResponseStatusCode()
  async forceSync() {
    return await this.appconfigService.synchronize();
  }

  @Get('testing')
  @ResponseStatusCode()
  async testing() {
    const stringText = 'This***Is**Brown*Fox';
    const sortingArray = [10, 2, 33, 7, 80, 12, 15, 100, 4, 5, 1, 2, 440];
    return {
      stringText: stringText.replace(/(?:[*]+)(.*?)([*]?)/g, ' '),
      sortingArray: sortingArray
        .sort((a, b) => a - b)
        .filter((value, index) => sortingArray.indexOf(value) == index),
    };
  }
}
