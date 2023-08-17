import { ChangeEvent, Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./user_form_template";
import {
  UserFormProps,
  UserFormController,
  UserFormState,
} from "./user_form_interface";
import { AuthService } from "../../services/auth_service";
import { UserType } from "../../../contrib/lib";

export class UserForm
  extends Component<UserFormProps, UserFormState>
  implements UserFormController
{
  private readonly authService = AuthService.getInstance();
  private unsubscribeRegisterResponse = () => {};
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
    this.unsubscribeRegisterResponse = this.authService.onRegisterResponse(
      (response) => {
        this.setState({ showSpinner: false });
        if (response.error) alert(response.error);
        else window.location.href = `/auth/login`;
      }
    );

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeRegisterResponse();
  };

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

  readonly handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const username = sanitize(formData.get("username")?.toString() ?? "");
    const email = sanitize(formData.get("email")?.toString() ?? "");
    const password = sanitize(formData.get("password")?.toString() ?? "");

    if (password.length <= 10) {
      alert("Your Password must be longer than 10 characters");
      return;
    }

    this.authService.feedRegister({
      username,
      email,
      password,
      type: UserType.INNER,
    });
    this.setState({ showSpinner: true });
  };

  get passwordStrength() {
    const password = this.state.password;
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
}
