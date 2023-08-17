import { Component, FormEvent } from "react";
import { template } from "./impersonation_template";
import {
  ImpersonationProps,
  ImpersonationController,
  ImpersonationState,
} from "./impersonation_interface";
import { AdminService } from "../../services/admin_service";
import { sanitize } from "isomorphic-dompurify";

export class Impersonation
  extends Component<ImpersonationProps, ImpersonationState>
  implements ImpersonationController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribeImpersonateUserResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ImpersonationProps) {
    super(props);
    this.state = { showSpinner: false };
  }

  componentDidMount(): void {
    document.addEventListener("beforeunload", this.cleanup);

    this.unsubscribeImpersonateUserResponse =
      this.adminService.onImpersonateUserResponse((response) => {
        this.setState({ showSpinner: false });

        if (response.error) alert(response.error);
        else window.location.href = `/in/${response.user.url}`;
      });
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeImpersonateUserResponse();
  };

  readonly onImpersonationSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const usernameOrId = sanitize(
      formData.get("usernameOrId")?.toString() ?? ""
    );

    this.adminService.feedImpersonateUser({ name_or_id: usernameOrId });
    this.setState({ showSpinner: true });
  };
}
