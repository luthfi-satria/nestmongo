import { Injectable } from '@nestjs/common';
import { ResponseService } from '../response/response.service';
import { MessageService } from '../message/message.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Useraccess,
  UseraccessDocument,
} from '../database/entities/usergroup_access.entity';

@Injectable()
export class UsergroupAccessService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    @InjectModel(Useraccess.name)
    private readonly accessRepo: Model<UseraccessDocument>,
  ) {}

  async getAccess() {
    return;
  }

  async create() {
    return;
  }

  async update() {
    return;
  }

  async delete() {
    return;
  }
}
