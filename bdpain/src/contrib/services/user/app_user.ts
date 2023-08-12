import { Md5 } from "ts-md5";
import { UserType, User } from "./lib";
import { SessionStorage } from "../storage/storage";

// The Apps Currently LoggedIn User.
export class AppUser {
  private static instance: AppUser;
  // User navigating through app.
  private user?: User;

  // The user the app is impersonating as.
  private impersonatingUser?: User;

  private constructor() {}

  public static getInstance(): AppUser {
    if (!AppUser.instance) AppUser.instance = new AppUser();

    return AppUser.instance;
  }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  removeUser() {
    this.user = undefined;
  }

  setImpersonatingUser(user: User) {
    this.impersonatingUser = user;
    SessionStorage.setItem("impersonatingUser", JSON.stringify(user));
  }

  getImpersonatingUser() {
    return this.impersonatingUser;
  }

  removeImpersonatingUser() {
    this.impersonatingUser = undefined;
    SessionStorage.removeItem("impersonatingUser");
  }

  getUserType(): UserType {
    return this.impersonatingUser?.type ?? this.user?.type ?? UserType.GUEST;
  }

  getUserID(): string | undefined {
    return this.impersonatingUser?.userId ?? this.user?.userId;
  }

  getUsername(): string | undefined {
    return this.impersonatingUser?.username ?? this.user?.username;
  }

  getUserEmail(): string | undefined {
    return this.impersonatingUser?.email ?? this.user?.email;
  }

  getUserEmailHash(): string {
    if (this.getUserType() === UserType.GUEST) return "";

    const email = (this.getUserEmail() ?? "").trim();
    return Md5.hashStr(email);
  }

  getUrl(): string {
    if (this.impersonatingUser) {
      return (
        this.impersonatingUser?.url ?? this.impersonatingUser?.userId ?? ""
      );
    }
    return this.user?.url ?? this.user?.userId ?? "";
  }
}
