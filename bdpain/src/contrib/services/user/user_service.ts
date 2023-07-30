import { Md5 } from "ts-md5";
import { UserType, User } from "./lib";
import { NetworkService } from "../network/network_service";
import { Subject, Observable, share, switchMap } from "rxjs";

interface UserRequest {
  username: string;
  password: string;
  email: string;

  // If set lets assume its an update request, since new users dont have this.
  userId?: string;
}

export class UserService {
  private readonly networkService = NetworkService.getInstance();
  private readonly request$ = new Subject<UserRequest>();
  private readonly response$: Observable<object>;
  private static instance: UserService;

  private constructor() {
    this.response$ = this.request$.pipe(
      switchMap((request) =>
        this.networkService.fetch("/users/register_user.php", request)
      ),
      share()
    );
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }

    return UserService.instance;
  }

  feedUser(request: UserRequest) {
    this.request$.next(request);
  }

  onUserSuccess(callback: (response: any) => void) {
    const subscriber = this.response$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
