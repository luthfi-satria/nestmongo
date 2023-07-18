import { Module } from '@nestjs/common';
import { UsergroupService } from './usergroup.service';
import { UsergroupController } from './usergroup.controller';
import { MessageService } from '../message/message.service';
import { ResponseService } from '../response/response.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsergroupDocument } from '../database/entities/usergroup.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UsergroupDocument])],
  providers: [UsergroupService, MessageService, ResponseService, JwtService],
  controllers: [UsergroupController],
  exports: [UsergroupService],
})
export class UsergroupModule {}
