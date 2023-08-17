import { SessionView, UserType } from "../../contrib/lib";
import { NetworkService } from "../../contrib/services/network_service";
import { AppUserService } from "../../contrib/services/app_user_service";
import { Subject, Observable, share, of, switchMap } from "rxjs";

interface AddUserRequest {
  username: string;
  email: string;
  password: string;
  type: UserType;
}

interface ForceLogoutRequest {
  name_or_id: string;
}

interface ImpersonateUserRequest {
  name_or_id: string;
}

interface InfoRequest {}

interface PromoteRequest {
  name_or_id: string;
  type: UserType;
}

interface SessionRequest {
  // When empty will create a new session.
  session_id?: string;
  // Destory
  destroy?: boolean;
}

export class AdminService {
  private readonly appUserService = AppUserService.getInstance();
  private readonly networkService = NetworkService.getInstance();
  private readonly addUserRequest$ = new Subject<AddUserRequest>();
  private readonly addUserResponse$: Observable<object>;

  private readonly forceLogoutRequest$ = new Subject<ForceLogoutRequest>();
  private readonly forceLogoutResponse$: Observable<object>;

  private readonly impersonateUserRequest$ =
    new Subject<ImpersonateUserRequest>();
  private readonly impersonateUserResponse$: Observable<object>;

  private readonly infoRequest$ = new Subject<InfoRequest>();
  private readonly infoResponse$: Observable<object>;

  private readonly promoteRequest$ = new Subject<PromoteRequest | undefined>();
  private readonly promoteResponse$: Observable<object>;

  private readonly sessionRequest$ = new Subject<SessionRequest>();
  private readonly sessionResponse$: Observable<object>;

  private static instance: AdminService;

  private constructor() {
    this.addUserResponse$ = this.addUserRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("admin/add_user.php", request)
      ),
      share()
    );

    this.forceLogoutResponse$ = this.forceLogoutRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("admin/force_logout.php", request)
      ),
      share()
    );

    this.impersonateUserResponse$ = this.impersonateUserRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("admin/impersonate_user.php", request).pipe(
          switchMap((response) => {
            if (response.success) {
              this.appUserService.setImpersonatingUser(response.user);
            }

            return of(response);
          })
        )
      ),
      share()
    );

    this.infoResponse$ = this.infoRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("admin/info.php", request)
      ),
      share()
    );

    this.promoteResponse$ = this.promoteRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("admin/promote.php", request)
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
          view: SessionView.ADMIN,
          viewed_id: null,
        });
      }),
      share()
    );
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }

    return AdminService.instance;
  }

  feedAddUser(request: AddUserRequest) {
    this.addUserRequest$.next(request);
  }

  feedForceLogout(request: ForceLogoutRequest) {
    this.forceLogoutRequest$.next(request);
  }

  feedImpersonateUser(request: ImpersonateUserRequest) {
    this.impersonateUserRequest$.next(request);
  }

  feedInfo() {
    this.infoRequest$.next({});
  }

  feedPromote(request?: PromoteRequest) {
    this.promoteRequest$.next(request);
  }

  feedSession(request: SessionRequest) {
    this.sessionRequest$.next(request);
  }

  onAddUserResponse(callback: (response: any) => void) {
    const subscriber = this.addUserResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onForceLogoutResponse(callback: (response: any) => void) {
    const subscriber = this.forceLogoutResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onImpersonateUserResponse(callback: (response: any) => void) {
    const subscriber = this.impersonateUserResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onInfoResponse(callback: (response: any) => void) {
    const subscriber = this.infoResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onPromoteResponse(callback: (response: any) => void) {
    const subscriber = this.promoteResponse$.subscribe(callback);
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
