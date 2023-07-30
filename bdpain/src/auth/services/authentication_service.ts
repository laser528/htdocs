import { NetworkService } from "../../contrib/services/network/network_service";
import { AppUser } from "../../contrib/services/user/app_user";
import { Observable, Subject, of, share, switchMap, tap } from "rxjs";

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
    const userStorage =
      localStorage.getItem("user") ?? sessionStorage.getItem("user");
    if (userStorage) this.appUser.setUser(JSON.parse(userStorage));

    this.response$ = this.request$.pipe(
      switchMap((request) =>
        this.networkService.fetch("authentication/login.php", request).pipe(
          switchMap((response: any) => {
            if (!response.success) {
              this.failedAttempts++;
              if (this.failedAttempts === 3) {
                this.failedAttempts = 0;
                localStorage.setItem("loginTimer", Date.now().toString());
              }
            }

            const user = {
              userId: response.user_id,
              username: response.username,
              email: response.email,
              type: response.type,
              url: response.url,
            };

            this.appUser.setUser(user);

            if (request.rememberMe) {
              localStorage.setItem("user", JSON.stringify(user));
            } else {
              sessionStorage.setItem("user", JSON.stringify(user));
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
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    localStorage.removeItem("loginTimer");
    this.failedAttempts = 0;
    this.appUser.removeUser();
  }

  private get timer() {
    return parseInt(localStorage.getItem("loginTimer") ?? "0");
  }

  canLogin() {
    if (!this.timer) {
      return { canLogin: true, failedAttempts: this.failedAttempts };
    } else {
      const waitTimeInMinutes = (this.timer + 3600000 - Date.now()) / 1000 / 60;
      if (waitTimeInMinutes <= 0) {
        localStorage.removeItem("loginTimer");
        return { canLogin: true, failedAttempts: 0 };
      }
      return {
        canLogin: false,
        howLongToWaitInMinutes: waitTimeInMinutes,
      };
    }
  }
}
