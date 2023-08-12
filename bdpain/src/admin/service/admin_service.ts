import { NetworkService } from "../../contrib/services/network/network_service";
import { Subject, Observable, share, switchMap, map } from "rxjs";

interface InfoRequest {}

interface ImpersonationRequest {
  user_id: string;
}

interface ForceLogoutRequest {
  user_id: string;
}

export class AdminService {
  private readonly networkService = NetworkService.getInstance();
  private readonly requestInfo$ = new Subject<InfoRequest>();
  private readonly responseInfo$: Observable<object>;

  private readonly requestImpersonation$ = new Subject<ImpersonationRequest>();
  private readonly responseImpersonation$: Observable<object>;

  private readonly requestForceLogout$ = new Subject<ForceLogoutRequest>();
  private readonly responseForceLogout$: Observable<object>;

  private static instance: AdminService;

  private constructor() {
    this.responseInfo$ = this.requestInfo$.pipe(
      switchMap((request) => this.networkService.fetch("admin/get_stats.php")),
      share()
    );

    this.responseImpersonation$ = this.requestImpersonation$.pipe(
      switchMap((request) =>
        this.networkService.fetch("admin/impersonate.php", request)
      ),
      share()
    );

    this.responseForceLogout$ = this.requestForceLogout$.pipe(
      switchMap((request) =>
        this.networkService.fetch("admin/force_logout.php", request)
      ),
      share()
    );
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }

    return AdminService.instance;
  }

  feedInfo(request: InfoRequest) {
    this.requestInfo$.next(request);
  }

  feedImpersonation(request: ImpersonationRequest) {
    this.requestImpersonation$.next(request);
  }

  feedForceLogout(request: ForceLogoutRequest) {
    this.requestForceLogout$.next(request);
  }

  onInfoSuccess(callback: (response: any) => void) {
    const subscriber = this.responseInfo$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onImpersonationSuccess(callback: (response: any) => void) {
    const subscriber = this.responseImpersonation$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onForceLogoutSuccess(callback: (response: any) => void) {
    const subscriber = this.responseForceLogout$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
