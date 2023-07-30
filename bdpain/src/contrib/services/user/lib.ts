export enum UserType {
  GUEST = "guest",
  INNER = "inner",
  STAFF = "staff",
  ADMIN = "admin",
}

export interface User {
  userId: string;
  username: string;
  email: string;
  type: UserType;
  url?: string;
}
