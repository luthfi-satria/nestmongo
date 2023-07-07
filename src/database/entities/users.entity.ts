import { Types } from 'mongoose';
import {
  Entity,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Level, UserType } from '../../hash/guard/interface/user.interface';

@Entity({ name: 'users' })
export class UsersDocument {
  @ObjectIdColumn()
  id: Types.ObjectId;

  @Column()
  name?: string;

  @Column()
  username?: string;

  @Column()
  email?: string;

  @Column()
  phone?: string;

  @Column()
  user_type?: UserType;

  @Column()
  level?: Level;

  @Column()
  password?: string;

  @Column()
  token_reset_password: string;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  verify_at?: Date;

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

  @DeleteDateColumn({
    nullable: true,
  })
  deleted_at?: Date;

  constructor(init?: Partial<UsersDocument>) {
    Object.assign(this, init);
  }
}
