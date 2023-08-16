import { SessionView } from "../../contrib/lib";
import { NetworkService } from "../../contrib/services/network_service";
import { Observable, Subject, share, switchMap } from "rxjs";

interface FetchRequest {
  opportunity_id?: string;
}

interface AddRequest {
  creator_id: string;
  title: string;
  content: string;
}

interface ModifyRequest {
  opportunity_id: string;
  creator_id: string;
  title: string;
  content: string;
}

interface DeleteRequest {
  opportunity_id: string;
}

interface SessionRequest {
  // When empty will create a new session.
  session_id?: string;
  destroy?: boolean;

  opportunity_id: string;
}

export class AuthService {
  private readonly networkService = NetworkService.getInstance();
  private readonly fetchRequest$ = new Subject<FetchRequest>();
  private readonly fetchResponse$: Observable<object>;

  private readonly addRequest$ = new Subject<AddRequest>();
  private readonly addResponse$: Observable<object>;

  private readonly modifyRequest$ = new Subject<ModifyRequest>();
  private readonly modifyResponse$: Observable<object>;

  private readonly deleteRequest$ = new Subject<DeleteRequest>();
  private readonly deleteResponse$: Observable<object>;

  private readonly sessionRequest$ = new Subject<SessionRequest>();
  private readonly sessionResponse$: Observable<object>;

  private static instance: AuthService;
  private failedAttempts = 0;

  private constructor() {
    this.fetchResponse$ = this.fetchRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("opportunity/fetch.php", request)
      ),
      share()
    );

    this.addResponse$ = this.addRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("opportunity/add.php", request)
      ),
      share()
    );

    this.modifyResponse$ = this.modifyRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("opportunity/modify.php", request)
      ),
      share()
    );

    this.deleteResponse$ = this.deleteRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("opportunity/delete.php", request)
      ),
      share()
    );

    this.sessionResponse$ = this.sessionRequest$.pipe(
      switchMap((request) => {
        return !!request.session_id
          ? this.networkService.fetch("session/update.php", request)
          : this.networkService.fetch("session/create.php", {
              view: SessionView.OPPORTUNITY,
              viewed_id: request.opportunity_id,
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

  feedFetch(request: FetchRequest) {
    this.fetchRequest$.next(request);
  }

  feedAdd(request: AddRequest) {
    this.addRequest$.next(request);
  }

  feedModify(request: ModifyRequest) {
    this.modifyRequest$.next(request);
  }

  feedDelete(request: DeleteRequest) {
    this.deleteRequest$.next(request);
  }

  feedSession(request: SessionRequest) {
    this.sessionRequest$.next(request);
  }

  onFetchResponse(callback: (response: any) => void) {
    const subscriber = this.fetchResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onAddResponse(callback: (response: any) => void) {
    const subscriber = this.addResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onModifyResponse(callback: (response: any) => void) {
    const subscriber = this.modifyResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onDeleteResponse(callback: (response: any) => void) {
    const subscriber = this.deleteResponse$.subscribe(callback);
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
