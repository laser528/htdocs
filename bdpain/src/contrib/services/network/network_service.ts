import { Observable, map, of, switchMap } from "rxjs";
import { AppUser } from "../user/app_user";
import Bottleneck from "bottleneck";

export class NetworkService {
  private static instance: NetworkService;
  private readonly appUser = AppUser.getInstance();
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
        if (!!userId) request = Object.assign(request, { userId });
        return request;
      }),
      switchMap((request) => this.networkRequest(path, request))
    );
  }

  private networkRequest(path: string, request: object): Promise<any> {
    return this.limiter.schedule(() =>
      fetch(`http://localhost/bdpain/server/${path}`, {
        method: "POST",
        body: JSON.stringify(request),
      }).then((response) => response.json())
    );
  }
}
