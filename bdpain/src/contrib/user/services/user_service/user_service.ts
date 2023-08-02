import { UserType, User, IUser } from "../../models/user";
import { NetworkService } from "../../../services/network/network_service";
import { Subject, Observable, share, switchMap } from "rxjs";
import { Md5 } from "ts-md5";
import {
  SessionStorage,
  LocalStorage,
} from "../../../services/storage/storage";

interface UserModifyRequest {
  username?: string;
  password?: string;
  email?: string;
  type: UserType;

  // If set lets assume its an update request, since new users dont have this.
  user_id?: string;
}

interface UserRequest {
  // If not set get a feed of users.
  user_id?: string;
  after?: string;
}

export class UserService {
  private static instance: UserService;
  private readonly networkService = NetworkService.getInstance();

  private readonly request$ = new Subject<UserRequest>();
  private readonly response$: Observable<object>;

  private readonly requestModify$ = new Subject<UserModifyRequest>();
  private readonly responseModify$: Observable<object>;

  private impersonator = new User();
  private loggedInUser = new User();

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  private constructor() {
    const userStorage =
      LocalStorage.getItem("user") ?? SessionStorage.getItem("user");
    const impersonationStorage = SessionStorage.getItem("impersonator");
    if (userStorage) this.loggedInUser = new User(userStorage as IUser);
    if (impersonationStorage)
      this.impersonator = new User(impersonationStorage as IUser);

    this.response$ = this.request$.pipe(
      switchMap((request) =>
        this.networkService.fetch("users/get_users.php", {
          payload: request,
          user_id: this.loggedInUser?.getUserID(),
        })
      ),
      share()
    );

    this.responseModify$ = this.requestModify$.pipe(
      switchMap((request) => {
        let path = "update_user.php";
        if (!request.user_id) path = "register_user.php";

        return this.networkService.fetch(`users/${path}`, {
          payload: request,
          user_id: this.getId(),
        });
      }),
      share()
    );
  }

  getId() {
    return this.impersonator.getUserID() || this.loggedInUser.getUserID();
  }

  feedModifyRequest(request: UserModifyRequest) {
    this.requestModify$.next(request);
  }

  onUserModifySuccess(callback: (response: any) => void) {
    const subscriber = this.responseModify$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  feedRequest(request: UserRequest) {
    this.request$.next(request);
  }

  onUserSuccess(callback: (response: any) => void) {
    const subscriber = this.response$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  setUser(user: User) {
    this.loggedInUser = user;
  }

  getUser() {
    return this.loggedInUser;
  }

  removeUser() {
    this.loggedInUser = new User();
  }

  setImpersonator(user: User) {
    this.impersonator = user;
    SessionStorage.setItem("impersonator", JSON.stringify(user));
  }

  getImpersonator() {
    return this.impersonator;
  }

  removeImpersonator() {
    this.impersonator = new User();
    SessionStorage.removeItem("impersonator");
  }

  getUserType(): UserType {
    return (
      this.impersonator?.getUserType() ??
      this.loggedInUser?.getUserType() ??
      UserType.GUEST
    );
  }

  getUserID(): string | undefined {
    return this.impersonator?.getUserID() ?? this.loggedInUser?.getUserID();
  }

  getUsername(): string | undefined {
    return this.impersonator?.getUsername() ?? this.loggedInUser?.getUsername();
  }

  getUserEmail(): string | undefined {
    return (
      this.impersonator?.getUserEmail() ?? this.loggedInUser?.getUserEmail()
    );
  }

  getUserEmailHash(): string {
    if (this.getUserType() === UserType.GUEST) return "";

    const email = (this.getUserEmail() ?? "").trim();
    return Md5.hashStr(email);
  }

  getUrl(): string {
    if (this.impersonator) {
      return (
        this.impersonator?.getUrl() ?? this.impersonator?.getUserID() ?? ""
      );
    }
    return this.loggedInUser?.getUrl() ?? this.loggedInUser?.getUserID() ?? "";
  }
}
