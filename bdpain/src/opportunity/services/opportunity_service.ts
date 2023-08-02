import { NetworkService } from "../../contrib/services/network/network_service";
import { Subject, Observable, share, switchMap, map } from "rxjs";
import { UserService } from "../../contrib/user/services/user_service/user_service";

interface OpportunityManageRequest {
  opportunity_id?: string;
  views?: string; // Used when an id is passed in to update views.
  creator_id?: string;
  title?: string;
  contents?: string;
  destroy?: boolean;
  key: string;
}

interface OpportunityRequest {
  after?: string;
  opportunity_id?: string;
}

export class OpportunityService {
  private readonly userService = UserService.getInstance();
  private readonly networkService = NetworkService.getInstance();
  private readonly request$ = new Subject<OpportunityRequest>();
  private readonly response$: Observable<object>;

  private readonly requestManage$ = new Subject<OpportunityManageRequest>();
  private readonly responseManage$: Observable<object>;
  private static instance: OpportunityService;

  private constructor() {
    this.response$ = this.request$.pipe(
      switchMap((request) => {
        if (request.opportunity_id) {
          return this.networkService.fetch("opportunity/get_opportunity.php", {
            payload: {
              opportunity_id: request.opportunity_id,
            },
            user_id: this.userService.getId(),
          });
        }

        return this.networkService.fetch("opportunity/get_opportunity.php", {
          payload: {
            after: request.after,
          },
          user_id: this.userService.getId(),
        });
      }),
      share()
    );

    this.responseManage$ = this.requestManage$.pipe(
      switchMap((request) => {
        if (!request.opportunity_id) {
          return this.networkService.fetch(
            "opportunity/create_opportunity.php",
            { payload: request, user_id: this.userService.getId() }
          );
        }

        const path = request.destroy
          ? "remove_opportunity.php"
          : "update_opportunity.php";
        return this.networkService
          .fetch(`opportunity/${path}`, { payload: request })
          .pipe(
            map((response) => {
              return { ...response, key: request.key };
            })
          );
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

  feedManageOpportunity(request: OpportunityManageRequest) {
    this.requestManage$.next(request);
  }

  feedOpportunity(request: OpportunityRequest) {
    this.request$.next(request);
  }

  onOpportunityManageSuccess(callback: (response: any) => void) {
    const subscriber = this.responseManage$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onOpportunitySuccess(callback: (response: any) => void) {
    const subscriber = this.response$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
