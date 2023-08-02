import { ChangeEvent, Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./user_form_template";
import {
  UserFormProps,
  UserFormController,
  UserFormState,
} from "./user_form_interface";
import { UserService } from "../../../contrib/user/services/user_service/user_service";
import { UserType } from "../../../contrib/user/models/user";

export class UserForm
  extends Component<UserFormProps, UserFormState>
  implements UserFormController
{
  private readonly userService = UserService.getInstance();
  private unsubscribe = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: UserFormProps) {
    super(props);
    this.state = {
      password: "",
      captcha: {
        one: Math.floor(Math.random() * 10),
        two: Math.floor(Math.random() * 10),
      },
      captchaAnswer: "",
      disabled: true,
      showSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribe = this.userService.onUserModifySuccess(
      this.onUserResponse
    );
  }

  componentWillUnmount(): void {
    this.unsubscribe();
  }

  readonly handleCaptchaChange = (event: ChangeEvent) => {
    const value = sanitize((event.target as HTMLInputElement).value);
    const answer = parseInt(value, 10);

    if (isNaN(answer)) {
      this.setState({ disabled: true, captchaAnswer: value });
      return;
    }

    this.setState({
      captchaAnswer: value,
      disabled:
        answer === this.state.captcha.one * this.state.captcha.two
          ? false
          : true,
    });
  };

  readonly handlePasswordChange = (event: ChangeEvent) => {
    const password = sanitize((event.target as HTMLInputElement).value);
    this.setState({ password });
  };

  private readonly onUserResponse = (response: any) => {
    this.setState({ showSpinner: false });
    if (response.error) {
      this.props.onError?.(response.error);
    } else window.location.href = `/auth/login`;
  };

  readonly handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const username = sanitize(formData.get("username")?.toString() ?? "");
    const email = sanitize(formData.get("email")?.toString() ?? "");
    const password = sanitize(formData.get("password")?.toString() ?? "");

    if (this.getPasswordStrength(password).variant === "WEAK") {
      this.props.onError?.("Your password must be longer!");
      return;
    }

    this.userService.feedModifyRequest({
      username,
      email,
      password,
      type: UserType.INNER,
    });
    this.setState({ showSpinner: true });
  };

  private getPasswordStrength(password: string) {
    let strength = "WEAK";
    let className = "danger";

    const passLen = password.length;
    if (passLen > 10 && passLen <= 17) {
      strength = "MODERATE";
      className = "warning";
    } else if (passLen > 17) {
      strength = "STRONG";
      className = "success";
    }

    return {
      variant: strength,
      class: className,
    };
  }

  get passwordStrength() {
    return this.getPasswordStrength(this.state.password);
  }
}
