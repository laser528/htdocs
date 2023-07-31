import { Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./login_form_template";

import {
  LoginFormProps,
  LoginFormController,
  LoginFormState,
} from "./login_form_interface";
import { AuthenticationService } from "../../services/authentication_service";

export class LoginForm
  extends Component<LoginFormProps, LoginFormState>
  implements LoginFormController
{
  private readonly auththenticationService =
    AuthenticationService.getInstance();
  private unsubscribe = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: LoginFormProps) {
    super(props);
    this.state = {
      showSpinner: false,
      loginAttempts:
        this.auththenticationService.canLogin().failedAttempts ?? 0,
    };
  }

  componentDidMount(): void {
    this.unsubscribe = this.auththenticationService.onAuthSuccess(
      this.onAuthResponse
    );
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  readonly handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const getCanLogin = this.auththenticationService.canLogin();
    if (!getCanLogin.canLogin) {
      this.props.onError?.(
        `You are not permitted to login for ${getCanLogin.howLongToWaitInMinutes}`
      );
      return;
    }

    const formData = new FormData(event.target as HTMLFormElement);
    const username = sanitize(formData.get("username")?.toString() ?? "");
    const password = sanitize(formData.get("password")?.toString() ?? "");
    const rememberMe = !!formData.get("rememberMe")?.toString();

    this.auththenticationService.publishRequest({
      username,
      password,
      rememberMe,
    });

    this.setState({ showSpinner: true });
  };

  private readonly onAuthResponse = (response: any) => {
    console.log(response);
    if (response.error) {
      this.props.onError?.(response.error);
      this.setState({
        showSpinner: false,
        loginAttempts: this.auththenticationService.canLogin().failedAttempts!,
      });
    } else {
      const url = `/in/${response.user.url}`;
      window.location.href = url;
    }
  };
}
