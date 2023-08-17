import { Observable, map, of, switchMap } from "rxjs";
import { AppUserService } from "./app_user_service";
import Bottleneck from "bottleneck";
import { EventService } from "./event_service";

export class NetworkService {
  private static instance: NetworkService;
  private readonly appUser = AppUserService.getInstance();
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
      map((payload) => {
        let request = { payload };
        const userId = this.appUser.getUserID();
        if (!!userId) request = Object.assign(request, { user_id: userId });
        return request;
      }),
      switchMap((request) => this.networkRequest(path, request))
    );
  }

  private networkRequest(
    path: string,
    request: object,
    headers?: {}
  ): Promise<any> {
    return this.limiter.schedule(() =>
      fetch(`http://localhost/bdpa_in/server/${path}`, {
        method: "POST",
        body: JSON.stringify(request),
        headers,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.logout) {
            // When force logout fire event to logout user. Will be heard by auth service.
            new EventService().fire("forceLogout");
          }
          return response;
        })
    );
  }
}
