import { Component } from "react";
import {
  ProfileController,
  ProfileProps,
  ProfileState,
} from "./profile_interface";
import { template } from "./profile_template";
import { ProfileService } from "../../services/profile_service";
import {
  withRouting,
  WithRouterProps,
} from "../../../contrib/components/route_component/route_component";
import { AppUserService } from "../../../contrib/services/app_user_service";

export class Profile
  extends Component<WithRouterProps<ProfileProps>, ProfileState>
  implements ProfileController
{
  private readonly appUserService = AppUserService.getInstance();
  private readonly profileService = ProfileService.getInstance();
  private unsubscribeFetchResponse = () => {};
  private unsubscribeSessionResponse = () => {};
  private clearSessionInterval = -1;
  private clearRefreshInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<ProfileProps>) {
    super(props);
    this.state = {
      profile: undefined,
      session_id: undefined,
      profile_url: this.url!,
    };
  }

  componentDidMount(): void {
    this.unsubscribeSessionResponse = this.profileService.onSessionResponse(
      (response) => {
        if (response.session_id) {
          this.setState({ session_id: response.session_id });
        }
      }
    );

    // Refresh Session every thirty seconds.
    this.clearSessionInterval = window.setInterval(() => {
      if (!this.state.profile) return;
      this.profileService.feedSession({
        session_id: this.state.session_id,
        profile_id: this.state.profile.user.user_id,
      });
    }, 30000);

    this.unsubscribeFetchResponse = this.profileService.onFetchResponse(
      (response) => {
        if (!response.success) {
          alert(response.error);
          window.location.href = "/404";
        }

        this.setState({ profile: response.profile });
      }
    );

    // Refresh content every 2 minutes.
    this.clearRefreshInterval = window.setInterval(() => {
      this.profileService.feedFetch({
        url: this.url!,
        is_signed_in: !!this.appUserService.getUser(),
      });
    }, 120000);

    this.profileService.feedFetch({
      url: this.url!,
      is_signed_in: !!this.appUserService.getUser(),
    });

    // Per requirements refresh every 30 secs.
    this.clearSessionInterval = window.setInterval(() => {
      if (!this.state.profile) return;
      this.profileService.feedSession({
        session_id: this.state.session_id,
        profile_id: this.state.profile.user.user_id,
      });
    }, 30000);

    window.addEventListener("beforeunload", this.cleanup);
    this.didMountOrUpdate();
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearRefreshInterval);
    window.clearInterval(this.clearSessionInterval);
    this.unsubscribeFetchResponse();
    this.unsubscribeSessionResponse();
  };

  componentDidUpdate(
    prevProps: Readonly<WithRouterProps<ProfileProps>>,
    prevState: Readonly<ProfileState>,
    snapshot?: any
  ): void {
    this.didMountOrUpdate(prevProps);
  }

  get url() {
    return this.props.params.id;
  }

  private didMountOrUpdate(prevProps?: WithRouterProps<ProfileProps>) {
    if (this.props.params.id !== prevProps?.params.id) {
      this.setState({ profile_url: this.props.params.id! });
    }
  }

  get isEditable() {
    if (!this.state.profile) return false;

    return this.state.profile.user.user_id! === this.appUserService.getUserID();
  }
}

export default withRouting<ProfileProps>(Profile);
