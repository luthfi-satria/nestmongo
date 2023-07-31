import mongoose from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { Usergroups } from './usergroup.entity';
import { Appmenus } from './menus.entity';

export type UseraccessDocument = Useraccess & Document;

@Schema()
export class Useraccess {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Usergroups' })
  @Type(() => Usergroups)
  usergroup?: Usergroups;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Appmenus' })
  @Type(() => Appmenus)
  menus?: Appmenus;

  @Prop()
  permission?: string[];

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

const UseraccessSchema = SchemaFactory.createForClass(Useraccess);

// UseraccessSchema.index({ name: 'text', is_default: 'text' });

export { UseraccessSchema };
