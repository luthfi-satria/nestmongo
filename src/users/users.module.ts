import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import { UserSchema, Users } from '../database/entities/users.entity';
import { ResponseService } from '../response/response.service';
import { MessageService } from '../message/message.service';
import {
  Usergroups,
  UsergroupsSchema,
} from '../database/entities/usergroup.entity';
import { AppconfigModule } from '../appconfig/appconfig.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: UserSchema },
      { name: Usergroups.name, schema: UsergroupsSchema },
    ]),
    AppconfigModule,
  ],
  exports: [UsersService],
  providers: [UsersService, ResponseService, MessageService, JwtService],
  controllers: [UsersController],
})
export class UsersModule {}
