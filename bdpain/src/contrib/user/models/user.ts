import { Md5 } from "ts-md5";

export enum UserType {
  GUEST = "guest",
  INNER = "inner",
  STAFF = "staff",
  ADMIN = "administrator",
}

export interface IUser {
  user_id: string;
  username: string;
  email: string;
  type: UserType;
  url?: string;
}

export class User {
  private user?: IUser;

  constructor(user?: IUser) {
    this.user = user;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  getUserType(): UserType {
    return this.user?.type ?? UserType.GUEST;
  }

  getUserID(): string | undefined {
    return this.user?.user_id;
  }

  getUsername(): string | undefined {
    return this.user?.username;
  }

  getUserEmail(): string | undefined {
    return this.user?.email;
  }

  getUserEmailHash(): string {
    if (this.getUserType() === UserType.GUEST) return "";

    const email = (this.getUserEmail() ?? "").trim();
    return Md5.hashStr(email);
  }

  getUrl(): string {
    return this.user?.url ?? this.user?.user_id ?? "";
  }
}
