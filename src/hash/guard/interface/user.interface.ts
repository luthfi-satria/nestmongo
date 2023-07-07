export enum UserType {
  User = 'user',
  Admin = 'admin',
  Staff = 'staff',
  Manager = 'manager',
  Director = 'director',
}

export enum Level {
  Owner = 'owner',
  Company = 'company',
  Public = 'public',
}

export interface User {
  id: string;
  user_type: UserType;
  level: Level;
}
