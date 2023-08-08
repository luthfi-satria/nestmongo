import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { scopeConfig } from '../../database/entities/appconfig.entities';
import { Types } from 'mongoose';
import { DBHelper } from '../../helper/database.helper';

export class GetAppconfigID {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value, key }) => DBHelper.toMongoObjectId({ value, key }))
  id: string;
}

export class AppconfigDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  desc: string;

  @IsString()
  @IsNotEmpty()
  scope: scopeConfig;

  @IsObject()
  @IsNotEmpty()
  value: any;

  @IsBoolean()
  @IsNotEmpty()
  is_active: boolean;
}

export class ListAppconfig {
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
