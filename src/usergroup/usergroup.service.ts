import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { UsergroupDto } from './dto/usergroup.dto';
import {
  Usergroups,
  UsergroupsDocument,
} from '../database/entities/usergroup.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from '../response/response.service';
import { DatetimeHelper } from '../helper/datetime.helper';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class UsergroupService {
  constructor(
    @InjectModel(Usergroups.name)
    private readonly usergroupRepo: Model<UsergroupsDocument>,
    private readonly responseService: ResponseService,
  ) {}

  async getAll() {
    return;
  }

  async findOne(search: any) {
    return await this.usergroupRepo.findOne(search);
  }

  async create(body: UsergroupDto) {
    try {
      const isExists = await this.usergroupRepo.findOne({
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

      const saveUsergroup = new this.usergroupRepo(body)
        .save()
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
      const updateUsergroup = await this.usergroupRepo.findOneAndReplace(
        { _id: id },
        updated,
        { new: true },
      );

      if (updateUsergroup) {
        return this.responseService.success(
          true,
          'user group has been updated!',
        );
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'user group',
          constraint: ['user group failed to update!'],
        },
        'user group failed to updated!',
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

      const deleteUsergroup = await this.usergroupRepo.findOneAndReplace(
        { _id: id },
        softDel,
        { new: true },
      );

      if (deleteUsergroup) {
        return this.responseService.success(
          true,
          'user group has been updated!',
        );
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'user group',
          constraint: ['user group failed to update!'],
        },
        'user group failed to updated!',
      );
    } catch (err) {
      Logger.log(err.message, 'Delete usergroup');
      throw err;
    }
  }

  async seeding() {
    try {
      const usergroupData = fs.readFileSync(
        join(process.cwd(), 'src/database/seeds/data/usergroup.data.json'),
        'utf-8',
      );

      const parseData = JSON.parse(usergroupData);
      let replacement;
      if (parseData) {
        for (const items in parseData) {
          const query = { _id: parseData[items]['_id'] };
          parseData[items]['_id'] = new Types.ObjectId(parseData[items]['_id']);
          replacement = await this.usergroupRepo.replaceOne(
            query,
            parseData[items],
          );
        }
      }

      if (!replacement) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: 'usergroup seeding process is error',
        };
      }

      return {
        code: HttpStatus.OK,
        message: 'usergroup seeding has been completed',
      };
    } catch (error) {
      Logger.log(error.message, 'Seeding data is aborting, file is not exists');
      throw error;
    }
  }
}
