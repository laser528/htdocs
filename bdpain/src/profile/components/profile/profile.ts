import { Component } from "react";
import {
  ProfileController,
  ProfileProps,
  ProfileState,
} from "./profile_interface";
import { template } from "./profile_template";
import { ProfileService } from "../../services/profile_service";
import { SessionService } from "../../../contrib/services/session/session_service";
import { User } from "../../../contrib/user/models/user";
import {
  withRouting,
  WithRouterProps,
} from "../../../contrib/components/route_component/route_component";
import { SessionType } from "../../../contrib/services/session/lib";
import { UserService } from "../../../contrib/user/services/user_service/user_service";

export class Profile
  extends Component<WithRouterProps<ProfileProps>, ProfileState>
  implements ProfileController
{
  private readonly userService = UserService.getInstance();
  private readonly profileService = ProfileService.getInstance();
  private readonly sessionService = SessionService.getInstance();
  private unsubscribeSessionCount = () => {};
  private unsubscribeSessionCreate = () => {};
  private unsubscribeSessionRefresh = () => {};
  private unsubscribeProfile = () => {};
  private clearSessionRefreshInterval = -1;
  private clearProfileRefreshInterval = -1;
  private sessionId = "";
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<ProfileProps>) {
    super(props);
    this.state = { profile: undefined, activeViewers: 1 };
  }

  componentDidMount(): void {
    this.unsubscribeSessionCount = this.sessionService.onSessionCountSuccess(
      (response) => {
        if (response.success) this.setState({ activeViewers: response.active });
      }
    );

    this.unsubscribeSessionCreate = this.sessionService.onSessionCreateSuccess(
      (response) => {
        if (response.success) this.sessionId = response.session_id;
      }
    );

    this.unsubscribeSessionRefresh =
      this.sessionService.onSessionRefreshSuccess(() => {});

    this.unsubscribeProfile = this.profileService.onProfileSuccess(
      (response) => {
        if (!response.success) {
          alert(response.error);
          window.location.href = "/404";
        }

        const user = response.user;

        this.sessionService.feedCountSession({
          type: "profile",
          id: response.user.user_id,
          key: this.props.params.id!,
        });

        const profile = {
          user: new User({
            user_id: user.user_id,
            type: user.type,
            username: user.username,
            email: user.email,
            url: this.props.params.id,
          }),
          sections: user.sections,
        };

        this.setState({ profile });
      }
    );

    // Refresh content every 2 minutes.
    this.clearProfileRefreshInterval = window.setInterval(
      this.loadProfile,
      120000
    );

    // Per requirements refresh every 30 secs.
    this.clearSessionRefreshInterval = window.setInterval(
      this.manageSession,
      30000
    );

    window.addEventListener("beforeunload", this.cleanup);
    this.didMountOrUpdate();
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearProfileRefreshInterval);
    window.clearInterval(this.clearSessionRefreshInterval);
    this.unsubscribeProfile();
    this.unsubscribeSessionCount();
    this.unsubscribeSessionCreate();
    this.unsubscribeSessionRefresh();

    if (this.sessionId) {
      this.sessionService.feedRefreshSession({
        session_id: this.sessionId,
        destroy: true,
      });
    }
  };

  componentDidUpdate(
    prevProps: Readonly<WithRouterProps<ProfileProps>>,
    prevState: Readonly<ProfileState>,
    snapshot?: any
  ): void {
    this.didMountOrUpdate(prevProps);
  }

  private didMountOrUpdate(prevProps?: WithRouterProps<ProfileProps>) {
    if (this.props.params.id !== prevProps?.params.id) {
      this.loadProfile();
    }
  }

  private readonly loadProfile = () => {
    // TODO increase views.
    this.profileService.feedProfileRequest({ url: this.props.params.id! });
  };

  private readonly manageSession = () => {
    if (!this.sessionId) {
      this.sessionService.feedCreateSession({
        view: SessionType.PROFILE,
        viewed_id: this.state.profile!.user.getUserID() ?? "",
      });
    } else {
      this.sessionService.feedRefreshSession({
        session_id: this.sessionId,
        destroy: false,
      });
    }
  };

  get isEditable() {
    if (!this.state.profile) return false;

    return this.state.profile.user.getUserID()! === this.userService.getId();
  }
}

export default withRouting<ProfileProps>(Profile);
