import { SessionView } from "../../contrib/lib";
import { NetworkService } from "../../contrib/services/network_service";
import {
  Observable,
  Subject,
  of,
  firstValueFrom,
  share,
  switchMap,
} from "rxjs";

interface FetchRequest {
  opportunity_id?: string;
}

interface AddRequest {
  creator_id: string;
  title: string;
  contents: string;
}

interface ModifyRequest {
  opportunity_id: string;
  title: string;
  contents: string;
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

export class OpportunityService {
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

  private static instance: OpportunityService;

  private constructor() {
    this.fetchResponse$ = this.fetchRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("opportunity/fetch.php", request).pipe(
          switchMap((response) => {
            if (response.opportunity) {
              this.feedSession({
                opportunity_id: response.opportunity.opportunity_id,
              });
              return this.networkService
                .fetch("opportunity/modify.php", {
                  opportunity_id: response.opportunity.opportunity_id,
                  views: "increment",
                })
                .pipe(
                  switchMap(async (response) => {
                    if (response.opportunity) {
                      const activeViewerResponse = await firstValueFrom(
                        this.networkService.fetch("session/count.php", {
                          type: "opportunity",
                          id: response.opportunity.opportunity_id,
                        })
                      );

                      if (activeViewerResponse.active)
                        response.opportunity.activeViewers =
                          activeViewerResponse.active;
                    }
                    return response;
                  })
                );
            }
            return of(response);
          })
        )
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
        if (!!request.session_id) {
          return !!request.destroy
            ? this.networkService.fetch("session/delete.php", request)
            : this.networkService.fetch("session/update.php", request);
        }

        return this.networkService.fetch("session/create.php", {
          view: SessionView.OPPORTUNITY,
          viewed_id: request.opportunity_id,
        });
      }),
      share()
    );
  }

  public static getInstance(): OpportunityService {
    if (!OpportunityService.instance) {
      OpportunityService.instance = new OpportunityService();
    }

    return OpportunityService.instance;
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
