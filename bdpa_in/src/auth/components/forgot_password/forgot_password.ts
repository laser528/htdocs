import { ChangeEvent, Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./forgot_password_template";
import {
  ForgotPasswordProps,
  ForgotPasswordController,
  ForgotPasswordState,
} from "./forgot_password_interface";
import { AuthService } from "../../services/auth_service";

export class ForgotPassword
  extends Component<ForgotPasswordProps, ForgotPasswordState>
  implements ForgotPasswordController
{
  private readonly authService = AuthService.getInstance();
  private unsubscribeForgotResponse = () => {};
  private unsubscribeChangePasswordResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ForgotPasswordProps) {
    super(props);
    this.state = {
      password: "",
      disabled: true,
      showSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeForgotResponse = this.authService.onForgotResponse(
      (response) => {
        this.setState({ showSpinner: false });
        if (!response.success) alert(response.error ?? "");
        else {
          alert("A Recovery Link has been sent to your email.");
          console.log(`http://localhost:3000/auth/forgot/${response.security}`);
          window.location.href = "/";
        }
      }
    );

    this.unsubscribeChangePasswordResponse =
      this.authService.onChangePasswordResponse((response) => {
        this.setState({ showSpinner: false });
        if (!response.success) alert(response.error ?? "");
        else {
          alert("Your Password has been successfully changed");
          window.location.href = "/auth/login";
        }
      });

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeForgotResponse();
    this.unsubscribeChangePasswordResponse();
  };

  readonly handlePasswordChange = (event: ChangeEvent) => {
    const password = sanitize((event.target as HTMLInputElement).value);
    this.setState({ password });
  };

  readonly handleForgotPasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const email = sanitize(formData.get("email")?.toString() ?? "");

    this.setState({ showSpinner: true });
    this.authService.feedForgot({ email });
  };

  readonly handleChangePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const password = sanitize(formData.get("password")?.toString() ?? "");
    const confirmation = sanitize(
      formData.get("confirmation")?.toString() ?? ""
    );

    if (password.length <= 10) {
      alert("Password must be longer than 10 characters");
      return;
    }

    if (password !== confirmation) {
      alert("Passwords Dont Match!");
      return;
    }

    this.setState({ showSpinner: true });
    this.authService.feedChangePassword({
      token: this.props.security!,
      password,
    });
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
