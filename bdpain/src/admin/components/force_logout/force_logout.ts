import { Component, FormEvent } from "react";
import { template } from "./force_logout_template";
import { sanitize } from "isomorphic-dompurify";
import {
  ForceLogoutProps,
  ForceLogoutController,
  ForceLogoutState,
} from "./force_logout_interface";
import { AdminService } from "../../service/admin_service";

export class ForceLogout
  extends Component<ForceLogoutProps, ForceLogoutState>
  implements ForceLogoutController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribeForceLogout = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ForceLogoutProps) {
    super(props);
    this.state = { showSpinner: false };
  }

  componentDidMount(): void {
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

    document.addEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeForceLogout();
  };

  readonly onForceLogoutSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const userId = sanitize(formData.get("userId")?.toString() ?? "");

    this.adminService.feedForceLogout({ user_id: userId });
    this.setState({ showSpinner: true });
  };
}
