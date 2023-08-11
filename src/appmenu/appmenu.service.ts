import { Injectable, Logger, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResponseService } from '../response/response.service';
import { DatetimeHelper } from '../helper/datetime.helper';
import { FilterQuery, Model } from 'mongoose';
import * as fs from 'fs';
import { join } from 'path';
import { Appmenus, AppmenusDocument } from '../database/entities/menus.entity';
import { AppmenuDto, ListAppmenu, UpdateAppmenuDto } from './dto/appmenu.dto';
import { RSuccessMessage } from '../response/response.interface';

@Injectable()
export class AppmenuService {
  constructor(
    @InjectModel(Appmenus.name)
    private readonly appmenuRepo: Model<AppmenusDocument>,
    private readonly responseService: ResponseService,
  ) {}

  async getAll(param: ListAppmenu) {
    try {
      const limit = param.limit || 10;
      const page = param.page || 1;
      const skip = (page - 1) * limit;
      const startId = param.startId || '';
      const filters: FilterQuery<AppmenusDocument> = startId
        ? {
            _id: {
              $gt: startId,
            },
          }
        : {};

      if (param.searchQuery) {
        filters.$text = {
          $search: param.searchQuery,
        };
      }
      const findQuery = await this.appmenuRepo
        .find(filters)
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit);

      const count = await this.appmenuRepo.count();
      const results: RSuccessMessage = {
        success: true,
        message: 'Get List application menu success',
        data: {
          total: count,
          page: page,
          skip: skip,
          limit: limit,
          items: findQuery,
        },
      };

      return results;
    } catch (err) {
      Logger.error(err.message, 'application configs failed to fetch');
      throw err;
    }
  }

  async findOne(search: any) {
    return await this.appmenuRepo.findOne(search);
  }

  async getDetailMenu(id) {
    const getConfig = await this.findOne({ _id: id });
    if (getConfig) {
      return this.responseService.success(true, 'application menu', getConfig);
    }
    return this.responseService.error(HttpStatus.BAD_REQUEST, {
      value: id,
      property: 'menu id',
      constraint: ['menu is not found'],
    });
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

  async update(id, body: UpdateAppmenuDto) {
    try {
      const isExists = await this.findOne({ _id: id });

      if (!isExists) {
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: 'id',
            property: 'id',
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
        join(process.cwd(), 'src/database/seeds/data/appmenu.data.json'),
        'utf-8',
      );

      const parseData = JSON.parse(AppmenuData);
      let replacement;
      if (parseData) {
        for (const items in parseData) {
          const query = { name: parseData[items]['name'] };
          replacement = await this.appmenuRepo.replaceOne(
            query,
            parseData[items],
            {
              upsert: true,
            },
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
