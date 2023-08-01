import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
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
  @IsString()
  sequence: number;

  @IsNotEmpty()
  @IsString()
  parent_id: string;

  @IsNotEmpty()
  @IsString()
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
