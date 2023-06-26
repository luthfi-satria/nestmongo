export enum UserType {
  User = 'user',
  Admin = 'admin',
}

export enum Level {
  free = 'free',
  member = 'member',
}

export interface User {
  id: string;
  user_type: UserType;
  level: Level;
}
