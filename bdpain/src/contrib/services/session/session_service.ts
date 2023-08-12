import { NetworkService } from "../../../contrib/services/network/network_service";
import { Subject, Observable, share, switchMap, map } from "rxjs";
import { SessionType } from "./lib";

interface SessionRequest {
  view: SessionType;
  viewed_id?: string;
}

interface SessionRefreshRequest {
  session_id: string;
  destroy: boolean;
}

interface SessionCountRequest {
  type: "profile" | "opportunity";
  id: string;
  key: string;
}

export class SessionService {
  private readonly networkService = NetworkService.getInstance();
  private readonly requestCreate$ = new Subject<SessionRequest>();
  private readonly responseCreate$: Observable<object>;

  private readonly requestRefresh$ = new Subject<SessionRefreshRequest>();
  private readonly responseRefresh$: Observable<object>;

  private readonly requestCount$ = new Subject<SessionCountRequest>();
  private readonly responseCount$: Observable<object>;
  private static instance: SessionService;

  private constructor() {
    this.responseCreate$ = this.requestCreate$.pipe(
      switchMap((request) =>
        this.networkService.fetch("session/create_session.php", request)
      ),
      share()
    );

    this.responseRefresh$ = this.requestRefresh$.pipe(
      switchMap((request) => {
        const path = request.destroy
          ? "remove_session.php"
          : "update_session.php";
        return this.networkService.fetch(`session/${path}`, {
          session_id: request.session_id,
        });
      }),
      share()
    );

    this.responseCount$ = this.requestCount$.pipe(
      switchMap((request) =>
        this.networkService
          .fetch(
            "session/count_session.php",
            request.type === "profile"
              ? {
                  user_id: request.id,
                }
              : {
                  opportunity_id: request.id,
                }
          )
          .pipe(
            map((response) => {
              return { ...response, key: request.type };
            })
          )
      ),
      share()
    );
  }

  public static getInstance(): SessionService {
    if (!SessionService.instance) {
      SessionService.instance = new SessionService();
    }

    return SessionService.instance;
  }

  feedCreateSession(request: SessionRequest) {
    this.requestCreate$.next(request);
  }

  feedRefreshSession(request: SessionRefreshRequest) {
    this.requestRefresh$.next(request);
  }

  feedCountSession(request: SessionCountRequest) {
    this.requestCount$.next(request);
  }

  onSessionCreateSuccess(callback: (response: any) => void) {
    const subscriber = this.responseCreate$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onSessionRefreshSuccess(callback: (response: any) => void) {
    const subscriber = this.responseRefresh$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onSessionCountSuccess(callback: (response: any) => void) {
    const subscriber = this.responseCount$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
