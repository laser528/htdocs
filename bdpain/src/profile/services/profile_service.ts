import { UserService } from "../../contrib/user/services/user_service/user_service";
import { NetworkService } from "../../contrib/services/network/network_service";
import { Subject, Observable, share, switchMap } from "rxjs";

interface ProfileRequest {
  url: string;
}

export interface ProfileSections {
  about?: string;
  experience?: DetailedSection[];
  education?: DetailedSection[];
  volunteering?: DetailedSection[];
  skills?: string[];
}

export interface DetailedSection {
  title: string;
  startedAt: number;
  endedAt?: number;
  location: string;
  description: string;
}

interface ProfileModifyRequest {
  user_id: string;
  url?: string;
  sections?: ProfileSections;
  views?: string;
}

export class ProfileService {
  private static instance: ProfileService;
  private readonly networkService = NetworkService.getInstance();
  private readonly userService = UserService.getInstance();

  private readonly request$ = new Subject<ProfileRequest>();
  private readonly response$: Observable<object>;

  private readonly requestModify$ = new Subject<ProfileModifyRequest>();
  private readonly responseModify$: Observable<object>;

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }

    return ProfileService.instance;
  }

  private constructor() {
    this.response$ = this.request$.pipe(
      switchMap((request) =>
        this.networkService.fetch("users/get_profile.php", {
          payload: request,
          user_id: this.userService.getId(),
        })
      ),
      share()
    );

    this.responseModify$ = this.requestModify$.pipe(
      switchMap((request) => {
        return this.networkService.fetch(`users/update_profile.php`, {
          payload: request,
          user_id: this.userService.getId(),
        });
      }),
      share()
    );
  }

  feedProfileModifyRequest(request: ProfileModifyRequest) {
    this.requestModify$.next(request);
  }

  onProfileModifySuccess(callback: (response: any) => void) {
    const subscriber = this.responseModify$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  feedProfileRequest(request: ProfileRequest) {
    this.request$.next(request);
  }

  onProfileSuccess(callback: (response: any) => void) {
    const subscriber = this.response$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }
}
