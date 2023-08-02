import { Observable, of, switchMap } from "rxjs";
import Bottleneck from "bottleneck";
import { EventService } from "../event/event_service";

export class NetworkService {
  private static instance: NetworkService;
  private readonly limiter = new Bottleneck({
    minTime: 200,
    maxConcurrent: 1,
  });

  private constructor() {}

  public static getInstance(): NetworkService {
    if (!NetworkService.instance) {
      NetworkService.instance = new NetworkService();
    }

    return NetworkService.instance;
  }

  public fetch(path: string, payload = {}): Observable<any> {
    return of(payload).pipe(
      switchMap((request) => this.networkRequest(path, request))
    );
  }

  private networkRequest(path: string, request: object): Promise<any> {
    return this.limiter.schedule(() =>
      fetch(`http://localhost/bdpain/server/${path}`, {
        method: "POST",
        body: JSON.stringify(request),
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.logout) {
            new EventService().fire("forceLogout");
          }
          return response;
        })
    );
  }
}
