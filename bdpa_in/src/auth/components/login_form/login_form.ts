import { Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./login_form_template";

import {
  LoginFormProps,
  LoginFormController,
  LoginFormState,
} from "./login_form_interface";
import { AuthService } from "../../services/auth_service";

export class LoginForm
  extends Component<LoginFormProps, LoginFormState>
  implements LoginFormController
{
  private readonly authService = AuthService.getInstance();
  private unsubscribeLoginResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: LoginFormProps) {
    super(props);
    this.state = {
      showSpinner: false,
      loginAttempts: this.authService.canLogin().failedAttempts ?? 0,
    };
  }

  componentDidMount(): void {
    this.unsubscribeLoginResponse = this.authService.onLoginResponse(
      (response) => {
        if (response.error) {
          alert(response.error);
          this.setState({
            showSpinner: false,
            loginAttempts: this.authService.canLogin().failedAttempts!,
          });
        } else {
          const url = `/in/${response.user.url}`;
          window.location.href = url;
        }
      }
    );

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeLoginResponse();
  };

  readonly handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const getCanLogin = this.authService.canLogin();
    if (!getCanLogin.canLogin) {
      alert(
        `You are not permitted to login for ${getCanLogin.howLongToWaitInMinutes}`
      );
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const username = sanitize(formData.get("username")?.toString() ?? "");
    const password = sanitize(formData.get("password")?.toString() ?? "");
    const rememberMe = !!formData.get("rememberMe")?.toString();

    this.authService.feedLogin({
      username,
      password,
      rememberMe,
    });

    this.setState({ showSpinner: true });
  };
}
