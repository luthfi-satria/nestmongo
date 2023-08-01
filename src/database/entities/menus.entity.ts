import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';
import { Transform } from 'class-transformer';

export type AppmenusDocument = Appmenus & Document;

@Schema()
export class Appmenus {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop()
  name?: string;

  @Prop()
  label?: string;

  @Prop()
  api_url?: string;

  @Prop()
  sequence?: number;

  @Prop()
  parent_id?: string;

  @Prop()
  level?: number;

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

const AppmenuSchema = SchemaFactory.createForClass(Appmenus);

AppmenuSchema.index({
  level: 'asc',
  sequence: 'asc',
  name: 'text',
  label: 'text',
});

export { AppmenuSchema };
