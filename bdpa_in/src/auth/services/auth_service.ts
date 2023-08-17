import { SessionView, UserType } from "../../contrib/lib";
import { AppUserService } from "../../contrib/services/app_user_service";
import { NetworkService } from "../../contrib/services/network_service";
import {
  LocalStorage,
  SessionStorage,
} from "../../contrib/services/storage_service";
import {
  Observable,
  Subject,
  firstValueFrom,
  of,
  share,
  switchMap,
} from "rxjs";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  type: UserType;
}

interface LoginRequest {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LogoutRequest {
  user_id: string;
}

interface ForgotRequest {
  email: string;
}

interface ChangePasswordRequest {
  token: string;
  password: string;
}

interface SessionRequest {
  // When empty will create a new session.
  session_id?: string;
  destroy?: boolean;
}

export class AuthService {
  private readonly appUserService = AppUserService.getInstance();
  private readonly networkService = NetworkService.getInstance();
  private readonly registerRequest$ = new Subject<RegisterRequest>();
  private readonly registerResponse$: Observable<object>;

  private readonly loginRequest$ = new Subject<LoginRequest>();
  private readonly loginResponse$: Observable<object>;

  private readonly logoutRequest$ = new Subject<LogoutRequest>();
  private readonly logoutResponse$: Observable<object>;

  private readonly forgotRequest$ = new Subject<ForgotRequest>();
  private readonly forgotResponse$: Observable<object>;

  private readonly changePasswordRequest$ =
    new Subject<ChangePasswordRequest>();
  private readonly changePasswordResponse$: Observable<object>;

  private readonly sessionRequest$ = new Subject<SessionRequest>();
  private readonly sessionResponse$: Observable<object>;

  private static instance: AuthService;
  private failedAttempts = 0;

  private constructor() {
    document.addEventListener("forceLogout", () => {
      firstValueFrom(
        this.networkService.fetch("auth/logout.php", {
          user_id: this.appUserService.getUserID(),
        })
      ).then((response) => {
        if (response.success) {
          this.logout();
          window.location.href = "/";
        } else {
          alert(response.error);
        }
      });
    });

    this.registerResponse$ = this.registerRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("auth/register.php", request)
      ),
      share()
    );

    this.loginResponse$ = this.loginRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("auth/login.php", request).pipe(
          switchMap((response: any) => {
            if (!response.success) {
              this.failedAttempts++;
              if (this.failedAttempts === 3) {
                this.failedAttempts = 0;
                LocalStorage.setItem("loginTimer", Date.now().toString());
              }
              return of(response);
            }

            this.appUserService.setUser(response.user);

            if (request.rememberMe) {
              LocalStorage.setItem("user", JSON.stringify(response.user));
            } else {
              SessionStorage.setItem("user", JSON.stringify(response.user));
            }
            return of(response);
          })
        )
      ),
      share()
    );

    this.logoutResponse$ = this.logoutRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("auth/logout.php", request)
      ),
      share()
    );

    this.forgotResponse$ = this.forgotRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("auth/forgot.php", request)
      ),
      share()
    );

    this.changePasswordResponse$ = this.changePasswordRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("auth/change_password.php", request)
      ),
      share()
    );

    this.sessionResponse$ = this.sessionRequest$.pipe(
      switchMap((request) => {
        if (request.session_id) {
          return !!request.destroy
            ? this.networkService.fetch("session/delete.php", request)
            : this.networkService.fetch("session/update.php", request);
        }

        return this.networkService.fetch("session/create.php", {
          view: SessionView.AUTH,
          viewed_id: null,
        });
      }),
      share()
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  feedRegister(request: RegisterRequest) {
    this.registerRequest$.next(request);
  }

  feedLogin(request: LoginRequest) {
    this.loginRequest$.next(request);
  }

  feedLogout(request: LogoutRequest) {
    this.logoutRequest$.next(request);
  }

  feedForgot(request: ForgotRequest) {
    this.forgotRequest$.next(request);
  }

  feedChangePassword(request: ChangePasswordRequest) {
    this.changePasswordRequest$.next(request);
  }

  feedSession(request: SessionRequest) {
    this.sessionRequest$.next(request);
  }

  onRegisterResponse(callback: (response: any) => void) {
    const subscriber = this.registerResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onLoginResponse(callback: (response: any) => void) {
    const subscriber = this.loginResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onLogoutResponse(callback: (response: any) => void) {
    const subscriber = this.logoutResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onForgotResponse(callback: (response: any) => void) {
    const subscriber = this.forgotResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onChangePasswordResponse(callback: (response: any) => void) {
    const subscriber = this.changePasswordResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onSessionResponse(callback: (response: any) => void) {
    const subscriber = this.sessionResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  isLoggedIn() {
    return !!this.appUserService.getUser();
  }

  logout() {
    LocalStorage.removeItem("user");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("impersonatingUser");
    LocalStorage.removeItem("loginTimer");
    this.failedAttempts = 0;
    this.appUserService.removeUser();
    this.appUserService.removeImpersonatingUser();
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
