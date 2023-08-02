import { ChangeEvent, Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./forgot_password_template";
import {
  ForgotPasswordProps,
  ForgotPasswordController,
  ForgotPasswordState,
} from "./forgot_password_interface";
import { NetworkService } from "../../../contrib/services/network/network_service";
import { firstValueFrom } from "rxjs";

export class ForgotPassword
  extends Component<ForgotPasswordProps, ForgotPasswordState>
  implements ForgotPasswordController
{
  private readonly networkService = NetworkService.getInstance();
  render = () => template.call(this, this.props, this.state);

  constructor(props: ForgotPasswordProps) {
    super(props);
    this.state = {
      password: "",
      disabled: true,
      showSpinner: false,
    };
  }

  readonly handlePasswordChange = (event: ChangeEvent) => {
    const password = sanitize((event.target as HTMLInputElement).value);
    this.setState({ password });
  };

  readonly handleForgotPasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const username = sanitize(formData.get("username")?.toString() ?? "");
    const email = sanitize(formData.get("email")?.toString() ?? "");

    this.setState({ showSpinner: true });
    const response = await firstValueFrom(
      this.networkService.fetch("authentication/lost_password.php", {
        payload: {
          username,
          email,
        },
      })
    );

    this.setState({ showSpinner: false });
    if (!response.success) this.props.onError?.(response.error ?? "");
    else {
      alert("A Recovery Link has been sent to your email.");
      console.log(`http://localhost:3000/auth/forgot/${response.security}`);
      (event.target as HTMLFormElement).reset();
    }
  };

  readonly handleChangePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const password = sanitize(formData.get("password")?.toString() ?? "");
    const confirmation = sanitize(
      formData.get("confirmation")?.toString() ?? ""
    );

    if (password !== confirmation) {
      this.props.onError?.("Passwords Dont Match!");
      return;
    }

    this.setState({ showSpinner: true });
    const response = await firstValueFrom(
      this.networkService.fetch("authentication/lost_password.php", {
        payload: {
          password,
          security: this.props.security ?? "",
        },
      })
    );

    this.setState({ showSpinner: false });
    if (!response.success) this.props.onError?.(response.error ?? "");
    else {
      alert("Your Password has been successfully changed");
      window.location.href = "/auth/login";
    }
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
