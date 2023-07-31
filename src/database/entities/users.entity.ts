import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { UserType } from '../../hash/guard/interface/user.interface';
import { Usergroups } from './usergroup.entity';

export type UsersDocument = Users & Document;

@Schema()
export class Users {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name?: string;

  @Prop()
  username?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  user_type?: UserType;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usergroups' })
  @Type(() => Usergroups)
  usergroup?: Usergroups;

  @Prop()
  password?: string;

  @Prop()
  token_reset_password: string;

  @Prop({
    type: 'date',
    nullable: true,
  })
  verify_at?: Date;

  @Prop({
    type: 'date',
    default: Date.now,
    nullable: true,
  })
  created_at?: Date;

  @Prop({
    type: 'date',
    default: Date.now,
    nullable: true,
  })
  updated_at?: Date;

  @Prop({
    nullable: true,
  })
  deleted_at?: Date;
}

const UserSchema = SchemaFactory.createForClass(Users);

UserSchema.index({
  name: 'text',
  email: 'text',
  username: 'text',
  phone: 'text',
});

export { UserSchema };
