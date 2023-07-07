import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';
import { Level, UserType } from '../../hash/guard/interface/user.interface';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { DBHelper } from '../../helper/database.helper';

export class GetUserDetail {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value, key }) => DBHelper.toMongoObjectId({ value, key }))
  id: string;
}
export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString()
  @Length(10, 15)
  phone: string;

  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  user_type: UserType;

  @IsString()
  @IsNotEmpty()
  level: Level;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString()
  @Length(10, 15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  user_type: UserType;

  @IsString()
  @IsNotEmpty()
  level: Level;
}
