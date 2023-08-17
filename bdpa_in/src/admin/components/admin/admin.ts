import { Component, MouseEvent } from "react";
import { template } from "./admin_template";
import {
  AdminProps,
  AdminController,
  AdminState,
  AdminView,
} from "./admin_interface";
import { AdminService } from "../../services/admin_service";

export class Admin
  extends Component<AdminProps, AdminState>
  implements AdminController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribeSessionResponse = () => {};
  private clearSessionInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: AdminProps) {
    super(props);
    this.state = { view: props.view ?? AdminView.INFO, session_id: undefined };
  }

  componentDidMount(): void {
    this.unsubscribeSessionResponse = this.adminService.onSessionResponse(
      (response) => {
        if (response.session_id) {
          this.setState({ session_id: response.session_id });
        }
      }
    );

    // Refresh Session every thirty seconds.
    this.adminService.feedSession({});
    this.clearSessionInterval = window.setInterval(() => {
      this.adminService.feedSession({ session_id: this.state.session_id });
    }, 30000);

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearSessionInterval);
    this.unsubscribeSessionResponse();

    this.adminService.feedSession({
      session_id: this.state.session_id,
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
