import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { DBHelper } from '../../helper/database.helper';
import { Types } from 'mongoose';

export class AppmenuDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  api_url: string;

  @IsNotEmpty()
  @IsNumber()
  sequence: number;

  @IsNotEmpty()
  @IsString()
  parent_id: string;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}

export class UpdateAppmenuDto {
  @IsNotEmpty()
  @IsString()
  label: string;

  @IsNotEmpty()
  @IsString()
  api_url: string;

  @IsNotEmpty()
  @IsNumber()
  sequence: number;

  @IsNotEmpty()
  @IsString()
  parent_id: string;

  @IsNotEmpty()
  @IsNumber()
  level: number;

  @IsNotEmpty()
  @IsBoolean()
  is_active: boolean;
}

export class GetAppmenuID {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value, key }) => DBHelper.toMongoObjectId({ value, key }))
  id: string;
}

export class ListAppmenu {
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
