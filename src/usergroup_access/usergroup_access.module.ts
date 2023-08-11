import { Module } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { ResponseService } from '../response/response.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { AppconfigModule } from '../appconfig/appconfig.module';
import {
  Useraccess,
  UseraccessSchema,
} from '../database/entities/usergroup_access.entity';
import { UsergroupAccessService } from './usergroup_access.service';
import { UsergroupAccessController } from './usergroup_access.controller';
import {
  Usergroups,
  UsergroupsSchema,
} from '../database/entities/usergroup.entity';
import { AppmenuSchema, Appmenus } from '../database/entities/menus.entity';
import { UsergroupModule } from '../usergroup/usergroup.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usergroups.name, schema: UsergroupsSchema },
      { name: Appmenus.name, schema: AppmenuSchema },
      { name: Useraccess.name, schema: UseraccessSchema },
    ]),
    AppconfigModule,
    UsergroupModule,
  ],
  providers: [
    UsergroupAccessService,
    MessageService,
    ResponseService,
    JwtService,
  ],
  controllers: [UsergroupAccessController],
  exports: [UsergroupAccessService],
})
export class UsergroupAccessModule {}
