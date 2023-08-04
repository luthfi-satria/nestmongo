import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Appconfig,
  AppconfigDocument,
} from '../database/entities/appconfig.entities';
import { AppconfigDto, ListAppconfig } from './dto/appconfig.dto';
import { ResponseService } from '../response/response.service';
import { MessageService } from '../message/message.service';
import { RSuccessMessage } from '../response/response.interface';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class AppconfigService {
  constructor(
    @InjectModel(Appconfig.name)
    private readonly appconfigRepo: Model<AppconfigDocument>,
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
  ) {}

  async listConfig(param: ListAppconfig) {
    try {
      const limit = param.limit || 10;
      const page = param.page || 1;
      const skip = (page - 1) * limit;
      const startId = param.startId || '';
      const filters: FilterQuery<AppconfigDocument> = startId
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
      const findQuery = await this.appconfigRepo
        .find(filters)
        .sort({ _id: 1 })
        .skip(skip)
        .limit(limit);

      const count = await this.appconfigRepo.count();
      const results: RSuccessMessage = {
        success: true,
        message: 'Get List application config success',
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
    return await this.appconfigRepo.findOne(search);
  }

  async update(id, body: AppconfigDto) {
    try {
      const isExists = await this.findOne({ _id: id });

      if (!isExists) {
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: body.name,
            property: 'name',
            constraint: ['configuration is not found!'],
          },
          'configuration is not found',
        );
      }

      const updated = Object.assign(isExists, body);
      const updateUsergroup = await this.appconfigRepo.updateOne(
        { _id: id },
        updated,
      );

      if (updateUsergroup) {
        return this.responseService.success(
          true,
          'configuration has been updated!',
        );
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'configuration',
          constraint: ['configuration failed to update!'],
        },
        'configuration failed to updated!',
      );
    } catch (err) {
      Logger.log(err.message, 'Cannot update configuration');
      throw err;
    }
  }

  async seeding() {
    try {
      const appconfigData = fs.readFileSync(
        join(process.cwd(), 'src/database/seeds/data/appconfig.data.json'),
        'utf-8',
      );

      const parseData = JSON.parse(appconfigData);
      let replacement;
      if (parseData) {
        for (const items in parseData) {
          const query = { scope: parseData[items]['scope'] };
          replacement = await this.appconfigRepo.replaceOne(
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
          message: 'application configuration seeding process is error',
        };
      }

      return {
        code: HttpStatus.OK,
        message: 'application configuration seeding has been completed',
      };
    } catch (error) {
      Logger.log(error.message, 'Seeding data is aborting, file is not exists');
      throw error;
    }
  }
}
