import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { UsergroupDto } from './dto/usergroup.dto';
import { Repository } from 'typeorm';
import { UsergroupDocument } from '../database/entities/usergroup.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseService } from '../response/response.service';
import { MessageService } from '../message/message.service';
import { DatetimeHelper } from '../helper/datetime.helper';

@Injectable()
export class UsergroupService {
  constructor(
    @InjectRepository(UsergroupDocument)
    private readonly usergroupRepo: Repository<UsergroupDocument>,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  async getAll() {
    return;
  }

  async findOne(search: any) {
    return await this.usergroupRepo.findOneBy(search);
  }

  async create(body: UsergroupDto) {
    try {
      const isExists = await this.usergroupRepo.findOneBy({
        name: body.name,
      });

      if (isExists) {
        return this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: body.name,
            property: 'name',
            constraint: ['usergroup name already registered!'],
          },
          'Usergroup name Already Exists',
        );
      }

      const saveUsergroup = await this.usergroupRepo
        .save(body)
        .catch((e) => {
          Logger.log(e.message, 'Create usergroup');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success Create usergroup!',
        saveUsergroup,
      );
    } catch (err) {
      Logger.error(err.message, 'Create new group failed');
      throw err;
    }
  }

  async update(id, body: UsergroupDto) {
    try {
      const isExists = await this.findOne({ _id: id });
      if (!isExists) {
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: body.name,
            property: 'name',
            constraint: ['usergroup is not found!'],
          },
          'Usergroup is not found',
        );
      }

      const updated = Object.assign(isExists, body);
      const updateUsergroup = await this.usergroupRepo
        .save(updated)
        .catch((e) => {
          Logger.log(e.message, 'update usergroup');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success update usergroup!',
        updateUsergroup,
      );
    } catch (err) {}
  }

  async delete(id) {
    try {
      const isExists = await this.findOne({ _id: id });
      if (!isExists) {
        return this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: id,
            property: 'id',
            constraint: ['usergroup is not found'],
          },
          'Usergroup is not found',
        );
      }
      const softDel = Object.assign(isExists, {
        deleted_at: DatetimeHelper.CurrentDateTime('ISO'),
      });

      const deleteUsergroup = await this.usergroupRepo
        .save(softDel)
        .catch((e) => {
          Logger.log(e.message, 'delete usergroup');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success deleting usergroup!',
        deleteUsergroup,
      );
    } catch (err) {
      Logger.log(err.message, 'Delete usergroup');
      throw err;
    }
  }
}
