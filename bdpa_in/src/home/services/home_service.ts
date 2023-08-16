import { SessionView } from "../../contrib/lib";
import { NetworkService } from "../../contrib/services/network_service";
import { Observable, Subject, share, switchMap } from "rxjs";

interface SessionRequest {
  // When empty will create a new session.
  session_id?: string;
}

export class HomeService {
  private readonly networkService = NetworkService.getInstance();

  private readonly sessionRequest$ = new Subject<SessionRequest>();
  private readonly sessionResponse$: Observable<object>;

  private static instance: HomeService;

  private constructor() {
    this.sessionResponse$ = this.sessionRequest$.pipe(
      switchMap((request) => {
        return !!request.session_id
          ? this.networkService.fetch("session/update.php", request)
          : this.networkService.fetch("session/create.php", {
              view: SessionView.HOME,
              viewed_id: null,
            });
      }),
      share()
    );
  }

  public static getInstance(): HomeService {
    if (!HomeService.instance) {
      HomeService.instance = new HomeService();
    }

    return HomeService.instance;
  }

  feedSession(request: SessionRequest) {
    this.sessionRequest$.next(request);
  }

  onSessionResponse(callback: (response: any) => void) {
    const subscriber = this.sessionResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
