import { Component, MouseEvent } from "react";
import { template } from "./admin_template";
import {
  AdminProps,
  AdminController,
  AdminState,
  AdminView,
} from "./admin_interface";
import { SessionService } from "../../../contrib/services/session/session_service";
import { SessionType } from "../../../contrib/services/session/lib";

export class Admin
  extends Component<AdminProps, AdminState>
  implements AdminController
{
  private readonly sessionService = SessionService.getInstance();
  private unsubscribeSessionCreate = () => {};
  private unsubscribeSessionRefresh = () => {};
  private clearRefreshTimeout = -1;
  private sessionId = "";
  render = () => template.call(this, this.props, this.state);

  constructor(props: AdminProps) {
    super(props);
    this.state = { view: props.view ?? AdminView.INFO };
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

    document.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeSessionCreate();
    this.unsubscribeSessionRefresh();
    window.clearTimeout(this.clearRefreshTimeout);

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
}
