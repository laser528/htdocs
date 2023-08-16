import { NetworkService } from "../../contrib/services/network_service";
import { Subject, Observable, share, switchMap } from "rxjs";

interface SyncRequest {}

export class AppService {
  private readonly networkService = NetworkService.getInstance();
  private readonly request$ = new Subject<SyncRequest>();
  private readonly response$: Observable<object>;
  private static instance: AppService;

  private constructor() {
    this.response$ = this.request$.pipe(
      switchMap((request) =>
        this.networkService.fetch("app/sync.php", request)
      ),
      share()
    );
  }

  public static getInstance(): AppService {
    if (!AppService.instance) {
      AppService.instance = new AppService();
    }

    return AppService.instance;
  }

  feedSync() {
    this.request$.next({});
  }

  onSyncResponse(callback: (response: any) => void) {
    const subscriber = this.response$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
