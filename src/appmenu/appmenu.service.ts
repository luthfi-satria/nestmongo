import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from '../response/response.service';
import { DatetimeHelper } from '../helper/datetime.helper';
import { Model, Types } from 'mongoose';
import * as fs from 'fs';
import { join } from 'path';
import { Appmenus, AppmenusDocument } from '../database/entities/menus.entity';
import { AppmenuDto } from './dto/appmenu.dto';

@Injectable()
export class AppmenuService {
  constructor(
    @InjectModel(Appmenus.name)
    private readonly appmenuRepo: Model<AppmenusDocument>,
    private readonly responseService: ResponseService,
  ) {}

  async getAll() {
    return;
  }

  async findOne(search: any) {
    return await this.appmenuRepo.findOne(search);
  }

  async create(body: AppmenuDto) {
    try {
      const isExists = await this.appmenuRepo.findOne({
        name: body.name,
      });

      if (isExists) {
        return this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: body.name,
            property: 'name',
            constraint: ['Appmenu name already registered!'],
          },
          'Appmenu name Already Exists',
        );
      }

      const save = new this.appmenuRepo(body)
        .save()
        .catch((e) => {
          Logger.log(e.message, 'Create appmenu');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success Create appmenu!',
        save,
      );
    } catch (err) {
      Logger.error(err.message, 'Create new appmenu');
      throw err;
    }
  }

  async update(id, body: AppmenuDto) {
    try {
      const isExists = await this.findOne({ _id: id });

      if (!isExists) {
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: body.name,
            property: 'name',
            constraint: ['Appmenu is not found!'],
          },
          'Appmenu is not found',
        );
      }

      const updated = Object.assign(isExists, body);
      const updateAction = await this.appmenuRepo.updateOne(
        { _id: id },
        updated,
      );

      if (updateAction) {
        return this.responseService.success(true, 'Appmenu has been updated!');
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'Appmenu',
          constraint: ['Appmenu failed to update!'],
        },
        'Appmenu failed to updated!',
      );
    } catch (err) {
      Logger.log(err.message, 'Cannot update Appmenu');
      throw err;
    }
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
            constraint: ['Appmenu is not found'],
          },
          'Appmenu is not found',
        );
      }
      const softDel = Object.assign(isExists, {
        deleted_at: DatetimeHelper.CurrentDateTime('ISO'),
      });

      const deleteAction = await this.appmenuRepo.findOneAndReplace(
        { _id: id },
        softDel,
        { new: true },
      );

      if (deleteAction) {
        return this.responseService.success(true, 'Appmenu has been updated!');
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'Appmenu',
          constraint: ['Appmenu failed to update!'],
        },
        'Appmenu failed to updated!',
      );
    } catch (err) {
      Logger.log(err.message, 'Delete Appmenu');
      throw err;
    }
  }

  async seeding() {
    try {
      const AppmenuData = fs.readFileSync(
        join(process.cwd(), 'src/database/seeds/data/Appmenu.data.json'),
        'utf-8',
      );

      const parseData = JSON.parse(AppmenuData);
      let replacement;
      if (parseData) {
        for (const items in parseData) {
          const query = { _id: parseData[items]['_id'] };
          parseData[items]['_id'] = new Types.ObjectId(parseData[items]['_id']);
          replacement = await this.appmenuRepo.replaceOne(
            query,
            parseData[items],
          );
        }
      }

      if (!replacement) {
        return {
          code: HttpStatus.BAD_REQUEST,
          message: 'Appmenu seeding process is error',
        };
      }

      return {
        code: HttpStatus.OK,
        message: 'Appmenu seeding has been completed',
      };
    } catch (error) {
      Logger.log(error.message, 'Seeding data is aborting, file is not exists');
      throw error;
    }
  }
}
