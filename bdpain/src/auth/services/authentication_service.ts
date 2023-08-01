import { NetworkService } from "../../contrib/services/network/network_service";
import { AppUser } from "../../contrib/services/user/app_user";
import {
  Observable,
  Subject,
  of,
  share,
  switchMap,
  firstValueFrom,
} from "rxjs";
import {
  LocalStorage,
  SessionStorage,
} from "../../contrib/services/storage/storage";

interface AuthRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

export class AuthenticationService {
  private static instance: AuthenticationService;
  private readonly networkService = NetworkService.getInstance();
  private readonly appUser = AppUser.getInstance();
  private readonly request$ = new Subject<AuthRequest>();
  private readonly response$: Observable<object>;
  private failedAttempts = 0;

  private constructor() {
    document.addEventListener("forceLogout", () => {
      firstValueFrom(
        this.networkService.fetch("authentication/remove_force_logout.php", {
          user_id: this.appUser.getUserID(),
        })
      ).then((response) => {
        this.logout();
        window.location.href = "/";
      });
    });

    const userStorage =
      LocalStorage.getItem("user") ?? SessionStorage.getItem("user");
    const impersonationStorage = SessionStorage.getItem("impersonatingUser");
    if (userStorage) this.appUser.setUser(userStorage);
    if (impersonationStorage)
      this.appUser.setImpersonatingUser(impersonationStorage);

    this.response$ = this.request$.pipe(
      switchMap((request) =>
        this.networkService.fetch("authentication/login.php", request).pipe(
          switchMap((response: any) => {
            if (!response.success) {
              this.failedAttempts++;
              if (this.failedAttempts === 3) {
                this.failedAttempts = 0;
                LocalStorage.setItem("loginTimer", Date.now().toString());
              }
              return of(response);
            }

            const user = {
              userId: response.user.user_id,
              username: response.user.username,
              email: response.user.email,
              type: response.user.type,
              url: response.user.url,
            };

            this.appUser.setUser(user);

            if (request.rememberMe) {
              LocalStorage.setItem("user", JSON.stringify(user));
            } else {
              SessionStorage.setItem("user", JSON.stringify(user));
            }
            return of(response);
          })
        )
      ),
      share()
    );
  }

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }

    return AuthenticationService.instance;
  }

  /** Emits new search request for processing. */
  publishRequest(request: AuthRequest) {
    this.request$.next(request);
  }

  onAuthSuccess(callback: (response: any) => void) {
    const subscriber = this.response$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  isLoggedIn() {
    return !!this.appUser.getUser();
  }

  logout() {
    LocalStorage.removeItem("user");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("impersonatingUser");
    LocalStorage.removeItem("loginTimer");
    this.failedAttempts = 0;
    this.appUser.removeUser();
    this.appUser.removeImpersonatingUser();
  }

  private get timer() {
    return parseInt(LocalStorage.getItem("loginTimer") ?? "0");
  }

  canLogin() {
    if (!this.timer) {
      return { canLogin: true, failedAttempts: this.failedAttempts };
    } else {
      const waitTimeInMinutes = (this.timer + 3600000 - Date.now()) / 1000 / 60;
      if (waitTimeInMinutes <= 0) {
        LocalStorage.removeItem("loginTimer");
        return { canLogin: true, failedAttempts: 0 };
      }
      return {
        canLogin: false,
        howLongToWaitInMinutes: waitTimeInMinutes,
      };
    }
  }
}
