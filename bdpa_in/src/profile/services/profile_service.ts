import {
  SessionView,
  UserProfileSection,
  UserProfileSectionType,
} from "../../contrib/lib";
import { NetworkService } from "../../contrib/services/network_service";
import {
  Observable,
  Subject,
  share,
  switchMap,
  of,
  firstValueFrom,
} from "rxjs";

interface FetchRequest {
  url: string;
  is_signed_in?: boolean;
}

interface FollowRequest {
  user_id: string;
  connection_id: string;
}

interface UnfollowRequest {
  user_id: string;
  connection_id: string;
}

interface ConnectionsFeedRequest {
  profile_id: string;
  user_id: string;
}

interface ModifyProfileAboutRequest {
  user_id: string;
  about: string;
}

interface ModifyProfileSkillsRequest {
  user_id: string;
  skills: string[];
}

interface ModifyProfileUserSectionRequest {
  user_id: string;
  type: UserProfileSectionType;
  section: UserProfileSection[];
}

interface ModifyProfileUrlRequest {
  url: string;
}

interface SessionRequest {
  // When empty will create a new session.
  session_id?: string;
  destroy?: boolean;

  profile_id: string;
}

export class ProfileService {
  private readonly networkService = NetworkService.getInstance();
  private readonly fetchRequest$ = new Subject<FetchRequest>();
  private readonly fetchResponse$: Observable<object>;

  private readonly followRequest$ = new Subject<FollowRequest>();
  private readonly followResponse$: Observable<object>;

  private readonly unfollowRequest$ = new Subject<UnfollowRequest>();
  private readonly unfollowResponse$: Observable<object>;

  private readonly connectionsFeedRequest$ =
    new Subject<ConnectionsFeedRequest>();
  private readonly connectionsFeedResponse$: Observable<object>;

  private readonly modifyProfileAboutRequest$ =
    new Subject<ModifyProfileAboutRequest>();
  private readonly modifyProfileAboutResponse$: Observable<object>;

  private readonly modifyProfileSkillsRequest$ =
    new Subject<ModifyProfileSkillsRequest>();
  private readonly modifyProfileSkillsResponse$: Observable<object>;

  private readonly modifyProfileUserSectionRequest$ =
    new Subject<ModifyProfileUserSectionRequest>();
  private readonly modifyProfileUserSectionResponse$: Observable<object>;

  private readonly modifyProfileUrlRequest$ =
    new Subject<ModifyProfileUrlRequest>();
  private readonly modifyProfileUrlResponse$: Observable<object>;

  private readonly sessionRequest$ = new Subject<SessionRequest>();
  private readonly sessionResponse$: Observable<object>;

  private static instance: ProfileService;

  private constructor() {
    this.fetchResponse$ = this.fetchRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("profile/fetch.php", request).pipe(
          switchMap(async (response) => {
            if (response.profile) {
              const activeViewerResponse = await firstValueFrom(
                this.networkService.fetch("session/count.php", {
                  type: "user",
                  id: response.profile.user.user_id,
                })
              );
              if (activeViewerResponse.success) {
                response.profile.activeViewers = activeViewerResponse.active;
              }
            }
            return response;
          })
        )
      ),
      share()
    );

    this.followResponse$ = this.followRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("profile/follow.php", request)
      ),
      share()
    );

    this.unfollowResponse$ = this.unfollowRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("profile/unfollow.php", request)
      ),
      share()
    );

    this.connectionsFeedResponse$ = this.connectionsFeedRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("opportunity/delete.php", request)
      ),
      share()
    );

    this.modifyProfileAboutResponse$ = this.fetchRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("profile/modify_profile_about.php", request)
      ),
      share()
    );

    this.modifyProfileSkillsResponse$ = this.modifyProfileSkillsRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("profile/modify_profile_skills.php", request)
      ),
      share()
    );

    this.modifyProfileUserSectionResponse$ =
      this.modifyProfileUserSectionRequest$.pipe(
        switchMap((request) =>
          this.networkService.fetch(
            "profile/modify_profile_user_section.php",
            request
          )
        ),
        share()
      );

    this.modifyProfileUrlResponse$ = this.modifyProfileUrlRequest$.pipe(
      switchMap((request) =>
        this.networkService.fetch("profile/modify_profile_url.php", request)
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
          view: SessionView.PROFILE,
          viewed_id: request.profile_id,
        });
      }),
      share()
    );
  }

  public static getInstance(): ProfileService {
    if (!ProfileService.instance) {
      ProfileService.instance = new ProfileService();
    }

    return ProfileService.instance;
  }

  feedFetch(request: FetchRequest) {
    this.fetchRequest$.next(request);
  }

  feedFollow(request: FollowRequest) {
    this.followRequest$.next(request);
  }

  feedUnfollow(request: UnfollowRequest) {
    this.unfollowRequest$.next(request);
  }

  feedConnectionsFeed(request: ConnectionsFeedRequest) {
    this.connectionsFeedRequest$.next(request);
  }

  feedModifyProfileAbout(request: ModifyProfileAboutRequest) {
    this.modifyProfileAboutRequest$.next(request);
  }

  feedModifyProfileSkills(request: ModifyProfileSkillsRequest) {
    this.modifyProfileSkillsRequest$.next(request);
  }

  feedModifyProfileUserSection(request: ModifyProfileUserSectionRequest) {
    this.modifyProfileUserSectionRequest$.next(request);
  }

  feedModifyProfileUrl(request: ModifyProfileUrlRequest) {
    this.modifyProfileUrlRequest$.next(request);
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

  onFollowResponse(callback: (response: any) => void) {
    const subscriber = this.followResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onUnfollowResponse(callback: (response: any) => void) {
    const subscriber = this.unfollowResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onConnectionsFeedResponse(callback: (response: any) => void) {
    const subscriber = this.connectionsFeedResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onModifyProfileAboutResponse(callback: (response: any) => void) {
    const subscriber = this.modifyProfileAboutResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onModifyProfileSkillsResponse(callback: (response: any) => void) {
    const subscriber = this.modifyProfileSkillsResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onModifyProfileUserSectionResponse(callback: (response: any) => void) {
    const subscriber =
      this.modifyProfileUserSectionResponse$.subscribe(callback);
    return () => {
      subscriber.unsubscribe();
    };
  }

  onModifyProfileUrlResponse(callback: (response: any) => void) {
    const subscriber = this.modifyProfileUrlResponse$.subscribe(callback);
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
