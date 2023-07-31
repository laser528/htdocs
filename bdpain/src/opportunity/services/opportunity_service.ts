import { NetworkService } from "../../contrib/services/network/network_service";
import { Subject, Observable, share, switchMap, firstValueFrom } from "rxjs";

interface OpportunityRequest {
  opportunity_id?: string;
  creator_id: string;
  title: string;
  contents: string;
}

export class OpportunityService {
  private readonly networkService = NetworkService.getInstance();
  private readonly request$ = new Subject<OpportunityRequest>();
  private readonly response$: Observable<object>;
  private static instance: OpportunityService;

  private constructor() {
    this.response$ = this.request$.pipe(
      switchMap((request) => {
        return !!request.opportunity_id
          ? this.networkService.fetch(
              "opportunity/update_opportunity.php",
              request
            )
          : this.networkService.fetch(
              "opportunity/create_opportunity.php",
              request
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

  feedOpportunity(request: OpportunityRequest) {
    this.request$.next(request);
  }

  onOpportunitySuccess(callback: (response: any) => void) {
    const subscriber = this.response$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  getFeed(after?: string) {
    return firstValueFrom(
      this.networkService.fetch("opportunity/get_opportunity.php", {
        after,
      })
    );
  }

  getOpportunity(id: string) {
    return firstValueFrom(
      this.networkService.fetch("opportunity/get_opportunity.php", {
        opportunity_id: id,
      })
    );
  }
}
