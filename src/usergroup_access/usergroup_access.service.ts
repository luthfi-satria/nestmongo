import { Injectable } from '@nestjs/common';
import { ResponseService } from '../response/response.service';
import { MessageService } from '../message/message.service';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AccessDocument } from '../database/entities/usergroup_access.entity';

@Injectable()
export class UsergroupAccessService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    @InjectRepository(AccessDocument)
    private readonly accessRepo: MongoRepository<AccessDocument>,
  ) {}

  async getAccess(user: any) {}

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
