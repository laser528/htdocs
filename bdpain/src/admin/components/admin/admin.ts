import { Component, FormEvent, MouseEvent } from "react";
import { template } from "./admin_template";
import { sanitize } from "isomorphic-dompurify";
import {
  AdminProps,
  AdminController,
  AdminState,
  AdminView,
} from "./admin_interface";
import { SessionService } from "../../../contrib/services/session/session_service";
import { SessionType } from "../../../contrib/services/session/lib";
import { AdminService } from "../../service/admin_service";
import { AppUser } from "../../../contrib/services/user/app_user";

export class Admin
  extends Component<AdminProps, AdminState>
  implements AdminController
{
  private readonly sessionService = SessionService.getInstance();
  private readonly adminService = AdminService.getInstance();
  private readonly appUser = AppUser.getInstance();
  private unsubscribeSessionCreate = () => {};
  private unsubscribeSessionRefresh = () => {};
  private unsubscribeInfo = () => {};
  private unsubscribeImpersonation = () => {};
  private unsubscribeForceLogout = () => {};
  private clearRefreshTimeout = -1;
  private clearInfoRefreshTimeout = -1;
  private sessionId = "";
  render = () => template.call(this, this.props, this.state);

  constructor(props: AdminProps) {
    super(props);
    this.state = { view: AdminView.INFO, showSpinner: false };
  }

  componentDidMount(): void {
    this.unsubscribeSessionCreate = this.sessionService.onSessionCreateSuccess(
      (response) => {
        if (response.session_id) this.sessionId = response.session_id;
      }
    );

    this.unsubscribeSessionRefresh =
      this.sessionService.onSessionRefreshSuccess((response) => {});

    this.clearRefreshTimeout = window.setInterval(() => {
      if (this.sessionId) {
        this.sessionService.feedRefreshSession({
          session_id: this.sessionId,
          destroy: false,
        });
      }
    }, 30000);

    this.sessionService.feedCreateSession({
      view: SessionType.ADMIN,
    });

    this.unsubscribeInfo = this.adminService.onInfoSuccess((response) => {
      if (response.success) this.setState({ info: response.info });
    });

    this.clearInfoRefreshTimeout = window.setInterval(() => {
      if (this.state.view === AdminView.INFO) {
        this.adminService.feedInfo({});
      }
    }, 120000);

    this.unsubscribeImpersonation = this.adminService.onImpersonationSuccess(
      (response) => {
        this.setState({ showSpinner: false });

        if (response.error) alert(response.error);
        else {
          this.appUser.setImpersonatingUser({
            userId: response.user.user_id,
            type: response.user.type,
            email: response.user.email,
            username: response.user.username,
            url: response.user.url,
          });
          const url = `/in/${response.user.url}`;
          window.location.href = url;
        }
      }
    );

    this.unsubscribeForceLogout = this.adminService.onForceLogoutSuccess(
      (response) => {
        this.setState({ showSpinner: false });

        if (response.error) alert(response.error);
        else {
          alert("User will be forced to logout on there next network request");
          (
            document.getElementById("forceLogoutForm") as HTMLFormElement
          ).reset();
        }
      }
    );

    this.didMountOrDidUpdate();
    document.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  componentDidUpdate(
    prevProps: Readonly<AdminProps>,
    prevState: Readonly<AdminState>,
    snapshot?: any
  ): void {
    this.didMountOrDidUpdate(prevState);
  }

  private didMountOrDidUpdate(prevState?: AdminState) {
    if (prevState?.view === this.state.view) return;

    if (this.state.view === AdminView.INFO) {
      this.adminService.feedInfo({});
    }
  }

  private readonly cleanup = () => {
    this.unsubscribeSessionCreate();
    this.unsubscribeSessionRefresh();
    this.unsubscribeInfo();
    this.unsubscribeImpersonation();
    this.unsubscribeForceLogout();
    window.clearTimeout(this.clearRefreshTimeout);
    window.clearTimeout(this.clearInfoRefreshTimeout);

    this.sessionService.feedRefreshSession({
      session_id: this.sessionId,
      destroy: true,
    });
  };

  readonly onInfoClick = (event: MouseEvent) => {
    event.preventDefault();

    this.setState({ view: AdminView.INFO });
  };

  readonly onImpersonationClick = (event: MouseEvent) => {
    event.preventDefault();

    this.setState({ view: AdminView.IMPERSONATION });
  };

  readonly onForceLogoutClick = (event: MouseEvent) => {
    event.preventDefault();

    this.setState({ view: AdminView.LOGOUT });
  };

  readonly onModifyUsersClick = (event: MouseEvent) => {
    event.preventDefault();

    this.setState({ view: AdminView.USERS });
  };

  readonly onImpersonationSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const userId = sanitize(formData.get("userId")?.toString() ?? "");

    this.adminService.feedImpersonation({ user_id: userId });
    this.setState({ showSpinner: true });
  };

  readonly onForceLogoutSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const userId = sanitize(formData.get("userId")?.toString() ?? "");

    this.adminService.feedForceLogout({ user_id: userId });
    this.setState({ showSpinner: true });
  };
}
