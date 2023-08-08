import { Module } from '@nestjs/common';
import { MessageService } from '../message/message.service';
import { ResponseService } from '../response/response.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import {
  Appconfig,
  AppconfigSchema,
} from '../database/entities/appconfig.entities';
import { AppconfigService } from './appconfig.service';
import { AppconfigController } from './appconfig.controller';
import { BullModule } from '@nestjs/bull';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appconfig.name, schema: AppconfigSchema },
    ]),
    BullModule.registerQueue({
      name: 'AppConfig',
    }),
  ],
  providers: [AppconfigService, MessageService, ResponseService, JwtService],
  controllers: [AppconfigController],
  exports: [AppconfigService],
})
export class AppconfigModule {}
