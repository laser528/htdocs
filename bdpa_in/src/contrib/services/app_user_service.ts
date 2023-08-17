import { Md5 } from "ts-md5";
import { UserType, User } from "../lib";
import { LocalStorage, SessionStorage } from "./storage_service";

// The Apps Currently LoggedIn User.
export class AppUserService {
  private static instance: AppUserService;
  // User navigating through app.
  private user?: User;

  // The user the app is impersonating as.
  private impersonatingUser?: User;

  private constructor() {
    // Upon starting, log user in if applicable.
    const userStorage =
      LocalStorage.getItem("user") ?? SessionStorage.getItem("user");
    const impersonationStorage = SessionStorage.getItem("impersonatingUser");
    if (userStorage) {
      this.user = userStorage as User;
    }

    if (impersonationStorage) {
      this.impersonatingUser = impersonationStorage as User;
    }
  }

  public static getInstance(): AppUserService {
    if (!AppUserService.instance)
      AppUserService.instance = new AppUserService();

    return AppUserService.instance;
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

  isImpersonating() {
    return !!this.impersonatingUser;
  }

  removeImpersonatingUser() {
    this.impersonatingUser = undefined;
    SessionStorage.removeItem("impersonatingUser");
  }

  getUserType(): UserType {
    return this.impersonatingUser?.type ?? this.user?.type ?? UserType.GUEST;
  }

  getUserID(): string | undefined {
    return this.impersonatingUser?.user_id ?? this.user?.user_id;
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
        this.impersonatingUser?.url ?? this.impersonatingUser?.user_id ?? ""
      );
    }
    return this.user?.url ?? this.user?.user_id ?? "";
  }
}
