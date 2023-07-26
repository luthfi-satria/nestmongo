import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { DBHelper } from '../../helper/database.helper';
import { Types } from 'mongoose';

export class UsergroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  is_default: boolean;
}

export class GetUsergroupID {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value, key }) => DBHelper.toMongoObjectId({ value, key }))
  id: string;
}
