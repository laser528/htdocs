import { Component, FormEvent } from "react";
import { template } from "./impersonation_template";
import {
  ImpersonationProps,
  ImpersonationController,
  ImpersonationState,
} from "./impersonation_interface";
import { AdminService } from "../../service/admin_service";
import { UserService } from "../../../contrib/user/services/user_service/user_service";
import { sanitize } from "isomorphic-dompurify";
import { User } from "../../../contrib/user/models/user";

export class Impersonation
  extends Component<ImpersonationProps, ImpersonationState>
  implements ImpersonationController
{
  private readonly userService = UserService.getInstance();
  private readonly adminService = AdminService.getInstance();
  private unsubscribeImpersonation = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ImpersonationProps) {
    super(props);
    this.state = { showSpinner: false };
  }

  componentDidMount(): void {
    document.addEventListener("beforeunload", this.cleanup);

    this.unsubscribeImpersonation = this.adminService.onImpersonationSuccess(
      (response) => {
        this.setState({ showSpinner: false });

        if (response.error) alert(response.error);
        else {
          this.userService.setImpersonator(
            new User({
              user_id: response.user.user_id,
              type: response.user.type,
              email: response.user.email,
              username: response.user.username,
              url: response.user.url,
            })
          );
          const url = `/in/${response.user.url}`;
          window.location.href = url;
        }
      }
    );
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeImpersonation();
  };

  readonly onImpersonationSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const userId = sanitize(formData.get("userId")?.toString() ?? "");

    this.adminService.feedImpersonation({ user_id: userId });
    this.setState({ showSpinner: true });
  };
}
