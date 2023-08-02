import { UserType, User } from "../../models/user";
import { NetworkService } from "../../../services/network/network_service";
import { Subject, Observable, share, switchMap } from "rxjs";
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
    const impersonationStorage = SessionStorage.getItem("impersonatingUser");
    // if (userStorage) this.loggedInUser = userStorage;
    if (impersonationStorage) this.impersonator = impersonationStorage;

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
    return this.impersonator.getUserID() ?? this.loggedInUser.getUserID();
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
}
