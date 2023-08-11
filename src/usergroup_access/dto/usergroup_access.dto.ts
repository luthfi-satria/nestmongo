import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DBHelper } from '../../helper/database.helper';
import { Types } from 'mongoose';
import { UserType } from '../../hash/guard/interface/user.interface';

export class UsergroupAccessDto {
  @IsString()
  @IsNotEmpty()
  usergroup_id: string;

  @IsEnum(UserType)
  @IsNotEmpty()
  level: UserType;

  @IsString()
  @IsNotEmpty()
  menu_id: string;

  @IsArray()
  @IsNotEmpty()
  permissions: string[];
}

export class GetUsergroupAccessID {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value, key }) => DBHelper.toMongoObjectId({ value, key }))
  id: string;
}

export class ListAccessmenu {
  @IsOptional()
  @IsString()
  startId: string;

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
