import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUsersDto, ListUser, UpdateUserDto } from './dto/users.dto';
import { randomUUID } from 'crypto';
import { genSaltSync, hash } from 'bcrypt';
import { Users, UsersDocument } from '../database/entities/users.entity';
import { ResponseService } from '../response/response.service';
import {
  Usergroups,
  UsergroupsDocument,
} from '../database/entities/usergroup.entity';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name)
    private readonly usersRepo: Model<UsersDocument>,
    private readonly responseService: ResponseService,
    @InjectModel(Usergroups.name)
    private readonly groupRepo: Model<UsergroupsDocument>,
  ) {}

  private readonly logger = new Logger(UsersService.name);

  async findOne(search: any) {
    return await this.usersRepo.findOne(search).populate('usergroup');
  }

  async register(data: CreateUsersDto) {
    try {
      const isExists = await this.usersRepo.findOne({
        email: data.email,
      });

      if (isExists) {
        return this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: data.email,
            property: 'email',
            constraint: ['email already registered!'],
          },
          'User Already Exists',
        );
      }

      const isPhoneExists = await this.usersRepo.findOne({
        phone: data.phone,
      });

      if (isPhoneExists) {
        return this.responseService.error(
          HttpStatus.CONFLICT,
          {
            value: data.phone,
            property: 'phone',
            constraint: ['Phone number already registered!'],
          },
          'User Already Exists',
        );
      }

      const token = randomUUID();
      const password = await this.generateHashPassword(data.password);

      // Get usergroup
      const usergroup = await this.groupRepo.findOne({
        name: data.usergroup,
      });

      if (!usergroup) {
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: data.usergroup,
            property: 'usergroup',
            constraint: ['Usergroup is not found!'],
          },
          'Usergroup is not found',
        );
      }
      const newUser = {
        ...data,
        usergroup: usergroup._id,
        password: password,
        token_reset_password: token,
      };

      const result: Record<string, any> = new this.usersRepo(newUser)
        .save()
        .catch((e) => {
          Logger.error(e.message, '', 'Create User');
          throw e;
        })
        .then((e) => {
          return e;
        });

      return this.responseService.success(
        true,
        'Success Create new user!',
        result,
      );
    } catch (err) {
      Logger.error(err.message, 'Create new User');
      throw err;
    }
  }

  async generateHashPassword(password: string): Promise<string> {
    const defaultSalt: number =
      Number(process.env.HASH_PASSWORDSALTLENGTH) || 10;
    const salt = genSaltSync(defaultSalt);
    return hash(password, salt);
  }

  async profile(id) {
    const getProfile = await this.findOne({ _id: id });
    if (getProfile) {
      return this.responseService.success(true, 'user profile', getProfile);
    }
    return this.responseService.error(HttpStatus.BAD_REQUEST, {
      value: id,
      property: 'id user',
      constraint: ['user is not found'],
    });
  }

  async update(id, body: Partial<UpdateUserDto>) {
    const verifyUser = await this.findOne({ _id: id });
    if (verifyUser) {
      // Get usergroup
      const usergroup = await this.groupRepo.findOne({
        name: body.usergroup,
      });
      if (!usergroup) {
        return this.responseService.error(
          HttpStatus.BAD_REQUEST,
          {
            value: id,
            property: 'usergroup',
            constraint: ['Usergroup is not found!'],
          },
          'Usergroup is not found',
        );
      }

      verifyUser.usergroup = usergroup._id;
      delete body.usergroup;
      const updated = Object.assign(verifyUser, body);

      const saveUpdate = await this.usersRepo.findOneAndReplace(
        { _id: id },
        updated,
        { new: true },
      );
      if (saveUpdate) {
        return this.responseService.success(
          true,
          'user account has been updated!',
        );
      }
      return this.responseService.error(
        HttpStatus.BAD_REQUEST,
        {
          value: id,
          property: 'user account',
          constraint: ['user account failed to update!'],
        },
        'user account failed to updated!',
      );
    }

    return this.responseService.error(
      HttpStatus.BAD_REQUEST,
      {
        value: id,
        property: 'user account',
        constraint: ['user account is not found!'],
      },
      'user account is not found',
    );
  }

  async listUser(param: ListUser) {
    return param;
  }
}
