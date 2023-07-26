import { Types } from 'mongoose';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usergroup_access' })
export class AccessDocument {
  @ObjectIdColumn()
  id: Types.ObjectId;

  @Column()
  group_id?: Types.ObjectId;

  @Column()
  menus_id?: Types.ObjectId;

  @Column()
  permissions?: string[];

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

  constructor(init?: Partial<AccessDocument>) {
    Object.assign(this, init);
  }
}
