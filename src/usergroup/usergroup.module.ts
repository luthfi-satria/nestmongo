import { Module } from '@nestjs/common';
import { UsergroupService } from './usergroup.service';
import { UsergroupController } from './usergroup.controller';
import { MessageService } from '../message/message.service';
import { ResponseService } from '../response/response.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Usergroups,
  UsergroupsSchema,
} from '../database/entities/usergroup.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Usergroups.name, schema: UsergroupsSchema },
    ]),
  ],
  providers: [UsergroupService, MessageService, ResponseService, JwtService],
  controllers: [UsergroupController],
  exports: [UsergroupService],
})
export class UsergroupModule {}
