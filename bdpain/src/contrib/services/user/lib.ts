export enum UserType {
  GUEST,
  INNER,
  STAFF,
  ADMIN,
}

export interface User {
  userId: string;
  username: string;
  email: string;
  type: UserType;
  url?: string;
}
