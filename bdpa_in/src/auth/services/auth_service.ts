import { SessionView, UserType } from "../../contrib/lib";
import { NetworkService } from "../../contrib/services/network_service";
import { Subject, Observable, share, switchMap } from "rxjs";

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  type: UserType;
  rememberMe: boolean;
}

interface LoginRequest {
  username: string;
  password: string;
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
}

export class AuthService {
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

  private constructor() {
    this.registerResponse$ = this.registerRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("auth/register.php", request)
      ),
      share()
    );

    this.loginResponse$ = this.loginRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("auth/login.php", request)
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
        this.networkService.fetch("admin/promote.php", request)
      ),
      share()
    );

    this.sessionResponse$ = this.sessionRequest$.pipe(
      switchMap((request) => {
        return !!request.session_id
          ? this.networkService.fetch("session/update.php", request)
          : this.networkService.fetch("session/create.php", {
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
}
