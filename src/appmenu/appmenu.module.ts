import { Module } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { ResponseService } from '../response/response.service';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtService } from '@nestjs/jwt';
import { AppmenuSchema, Appmenus } from '../database/entities/menus.entity';
import { AppmenuService } from './appmenu.service';
import { AppmenuController } from './appmenu.controller';
import { AppconfigModule } from '../appconfig/appconfig.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appmenus.name, schema: AppmenuSchema }]),
    AppconfigModule,
  ],
  providers: [AppmenuService, MessageService, ResponseService, JwtService],
  controllers: [AppmenuController],
  exports: [AppmenuService],
})
export class AppmenuModule {}
