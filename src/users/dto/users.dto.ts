import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
  Min,
  ValidateIf,
} from 'class-validator';
import { UserType } from '../../hash/guard/interface/user.interface';
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
  usergroup: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString()
  @Length(10, 15)
  phone: string;

  @IsString()
  @IsNotEmpty()
  user_type: UserType;

  @IsString()
  @IsNotEmpty()
  usergroup: string;
}

export class ListUser {
  @IsOptional()
  @IsString()
  startId: string;

  // @IsOptional()
  // @IsString()
  // name: string;

  // @IsOptional()
  // @IsString()
  // email: string;

  // @IsOptional()
  // @IsString()
  // username: string;

  // @IsOptional()
  // @IsString()
  // phone: string;

  // @IsOptional()
  // @IsString()
  // type: string;

  // @IsOptional()
  // @IsString()
  // usergroup: string;
  @IsOptional()
  @IsString()
  searchQuery: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  skip: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  page: number;
}
