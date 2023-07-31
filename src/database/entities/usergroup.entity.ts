import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type UsergroupsDocument = Usergroups & Document;

@Schema()
export class Usergroups {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name?: string;

  @Prop()
  is_default?: boolean;

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

const UsergroupsSchema = SchemaFactory.createForClass(Usergroups);

UsergroupsSchema.index({ name: 'text', is_default: 'text' });

export { UsergroupsSchema };
