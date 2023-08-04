import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type AppconfigDocument = Appconfig & Document;

export enum scopeConfig {
  GLOBAL = 'global',
  SCHEDULLER = 'scheduller',
  PAGINATION = 'pagination',
}

@Schema()
export class Appconfig {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  ref_id?: string;

  @Prop()
  name?: string;

  @Prop()
  desc?: string;

  @Prop()
  scope?: scopeConfig;

  @Prop({ type: Object })
  value?: any;

  @Prop()
  is_active?: boolean;

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

const AppconfigSchema = SchemaFactory.createForClass(Appconfig);

AppconfigSchema.index({
  scope: 'asc',
  name: 'asc',
  is_active: 'asc',
  value: 'text',
});

export { AppconfigSchema };
