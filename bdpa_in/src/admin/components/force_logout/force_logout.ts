import { Component, FormEvent } from "react";
import { template } from "./force_logout_template";
import { sanitize } from "isomorphic-dompurify";
import {
  ForceLogoutProps,
  ForceLogoutController,
  ForceLogoutState,
} from "./force_logout_interface";
import { AdminService } from "../../services/admin_service";

export class ForceLogout
  extends Component<ForceLogoutProps, ForceLogoutState>
  implements ForceLogoutController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribeForceLogoutResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ForceLogoutProps) {
    super(props);
    this.state = { showSpinner: false };
  }

  componentDidMount(): void {
    this.unsubscribeForceLogoutResponse =
      this.adminService.onForceLogoutResponse((response) => {
        this.setState({ showSpinner: false });

        if (response.error) alert(response.error);
        else {
          alert("User will be forced to logout on there next network request");
          (
            document.getElementById("forceLogoutForm") as HTMLFormElement
          ).reset();
        }
      });

    document.addEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeForceLogoutResponse();
  };

  readonly onForceLogoutSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const usernameOrId = sanitize(
      formData.get("usernameOrId")?.toString() ?? ""
    );

    this.adminService.feedForceLogout({ name_or_id: usernameOrId });
    this.setState({ showSpinner: true });
  };
}
