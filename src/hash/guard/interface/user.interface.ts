import { UsergroupsDocument } from '../../../database/entities/usergroup.entity';

export enum UserType {
  User = 'user',
  Admin = 'admin',
  Staff = 'staff',
  Manager = 'manager',
  Director = 'director',
}

export interface User {
  id: string;
  user_type: UserType;
  usergroup: UsergroupsDocument;
}
