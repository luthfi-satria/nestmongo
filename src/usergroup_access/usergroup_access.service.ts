import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ResponseService } from '../response/response.service';
import { MessageService } from '../message/message.service';
import { FilterQuery, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  Useraccess,
  UseraccessDocument,
} from '../database/entities/usergroup_access.entity';
import { RSuccessMessage } from '../response/response.interface';
import { DatetimeHelper } from '../helper/datetime.helper';
import { ListAccessmenu } from './dto/usergroup_access.dto';
import { UsergroupService } from '../usergroup/usergroup.service';

@Injectable()
export class UsergroupAccessService {
  constructor(
    private readonly responseService: ResponseService,
    private readonly messageService: MessageService,
    @InjectModel(Useraccess.name)
    private readonly accessRepo: Model<UseraccessDocument>,
    private readonly usergroupService: UsergroupService,
  ) {}
  private Logger = new Logger(UsergroupAccessService.name);

  async getAll(param: ListAccessmenu) {
    try {
      const limit = param.limit || 10;
      const page = param.page || 1;
      const skip = (page - 1) * limit;
      const startId = param.startId || '';
      const filters: FilterQuery<UseraccessDocument> = startId
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
      const findQuery = await this.accessRepo
        .find(filters)
        .sort({ _id: 1 })
        .populate('usergroup')
        .populate('menu')
        .skip(skip)
        .limit(limit);

      const count = await this.accessRepo.count();
      const results: RSuccessMessage = {
        success: true,
        message: 'Get List access success',
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
      Logger.error(err.message, 'access menu failed to fetch');
      throw err;
    }
  }

  async findOne(search: any) {
    return await this.accessRepo.findOne(search);
  }

  async getAccess(user) {
    try {
      const usergroup = await this.usergroupService.findOne({
        name: user.usergroup,
      });
      if (usergroup) {
        const getAccess = await this.accessRepo
          .find({
            usergroup: usergroup?._id,
          })
          .populate('menu');
        if (getAccess) {
          return this.responseService.success(true, 'access menu', getAccess);
        }
      }
      return this.responseService.error(HttpStatus.BAD_REQUEST, {
        value: user.usergroup,
        property: 'access id',
        constraint: ['access menu may not configured'],
      });
    } catch (error) {
      Logger.log(error.message, 'invalid usergroup id');
      throw error;
    }
  }

  async create(body) {
    try {
      const isExists = await this.accessRepo.findOne({
        usergroup: body.usergroup_id,
        menu: body.menu_id,
      });

      if (isExists) {
        return this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: body.name,
            property: 'name',
            constraint: ['access menu already configured'],
          },
          'access menu already configured',
        );
      }

      body.usergroup = body.usergroup_id;
      body.menu = body.menu_id;
      delete body.usergroup_id;
      delete body.menu_id;

      const save = new this.accessRepo(body)
        .save()
        .catch((e) => {
          Logger.log(e.message, 'Create access menu');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success Create Access Menu!',
        save,
      );
    } catch (err) {
      Logger.error(err.message, 'Create new appmenu');
      throw err;
    }
  }

  async update(id, body) {
    try {
      const isExists = await this.findOne({ _id: id });

      if (!isExists) {
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: 'id',
            property: 'id',
            constraint: ['Access is not found!'],
          },
          'Access is not found',
        );
      }

      body.usergroup = body.usergroup_id;
      body.menu = body.menu_id;
      delete body.usergroup_id;
      delete body.menu_id;

      const updated = Object.assign(isExists, body);
      const updateAction = await this.accessRepo.updateOne(
        { _id: id },
        updated,
      );

      if (updateAction) {
        return this.responseService.success(
          true,
          'Access menu has been updated!',
        );
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'Access menu',
          constraint: ['Access menu failed to update!'],
        },
        'Access menu failed to updated!',
      );
    } catch (err) {
      Logger.log(err.message, 'Cannot update Access menu');
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
            constraint: ['Access menu is not found'],
          },
          'Access menu is not found',
        );
      }
      const softDel = Object.assign(isExists, {
        deleted_at: DatetimeHelper.CurrentDateTime('ISO'),
      });

      const deleteAction = await this.accessRepo.findOneAndReplace(
        { _id: id },
        softDel,
        { new: true },
      );

      if (deleteAction) {
        return this.responseService.success(
          true,
          'Access menu has been updated!',
        );
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'Access menu',
          constraint: ['Access menu failed to update!'],
        },
        'Access menu failed to updated!',
      );
    } catch (err) {
      Logger.log(err.message, 'Delete Access menu');
      throw err;
    }
  }
}
