import { Types } from 'mongoose';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'menus' })
export class MenusDocuments {
  @ObjectIdColumn()
  id: Types.ObjectId;

  @Column()
  name?: string;

  @Column()
  label?: string;

  @Column()
  api_url?: string;

  @Column()
  sequence?: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  created_at?: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  updated_at?: Date;

  @Column({
    nullable: true,
  })
  deleted_at?: Date;

  constructor(init?: Partial<MenusDocuments>) {
    Object.assign(this, init);
  }
}
