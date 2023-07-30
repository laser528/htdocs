import { Observable } from "rxjs";

export interface FetchOptions<T> {
  path: string;
  payload?: T;
}

export interface INetworkService {
  fetch<Request = {}, Response = {}>(
    options: FetchOptions<Request>
  ): Observable<Response>;
}
