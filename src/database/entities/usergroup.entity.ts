import { Types } from 'mongoose';
import {
  Column,
  CreateDateColumn,
  Entity,
  ObjectIdColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'usergroup' })
export class UsergroupDocument {
  @ObjectIdColumn()
  _id: Types.ObjectId;

  @Column()
  name?: string;

  @Column({ default: false, nullable: false })
  is_default?: boolean;

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

  constructor(init?: Partial<UsergroupDocument>) {
    Object.assign(this, init);
  }
}
