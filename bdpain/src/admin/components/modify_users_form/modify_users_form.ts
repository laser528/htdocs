import { ChangeEvent, Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./modify_users_form_template";
import {
  ModifyUsersFormProps,
  ModifyUsersFormController,
  ModifyUsersFormState,
} from "./modify_users_form_interface";
import { UserService } from "../../../contrib/user/services/user_service/user_service";
import { UserType } from "../../../contrib/user/models/user";

export class ModifyUsersForm
  extends Component<ModifyUsersFormProps, ModifyUsersFormState>
  implements ModifyUsersFormController
{
  private readonly userService = UserService.getInstance();
  private unsubscribeModify = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ModifyUsersFormProps) {
    super(props);
    this.state = {
      username: props.user?.getUsername() ?? "",
      email: props.user?.getUserEmail() ?? "",
      password: "",
      showSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeModify = this.userService.onUserModifySuccess(
      (response) => {
        this.setState({ showSpinner: false });
        if (response.error) {
          alert(response.error);
          return;
        }

        if (response.user) {
          alert(`User ${response.user.username} Successfully Created!`);
        } else alert(`${this.state.username} Successfully Modified`);
        this.props.onComplete?.();
      }
    );

    document.addEventListener("beforeunload", this.cleanup);
    this.didMountOrUpdate();
  }

  componentDidUpdate(
    prevProps: Readonly<ModifyUsersFormProps>,
    prevState: Readonly<ModifyUsersFormState>,
    snapshot?: any
  ): void {
    this.didMountOrUpdate(prevProps);
  }

  private didMountOrUpdate(prevProps?: ModifyUsersFormProps) {
    if (prevProps?.user !== this.props.user) {
      this.setState({
        username: this.props.user?.getUsername() ?? "",
        email: this.props.user?.getUserEmail() ?? "",
        password: "",
        showSpinner: false,
      });
    }
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeModify();
  };

  readonly onModifyFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const username = !!formData.get("username")
      ? sanitize(formData.get("username")!.toString())
      : undefined;
    const password = !!formData.get("password")
      ? sanitize(formData.get("password")!.toString())
      : undefined;
    const email = !!formData.get("email")
      ? sanitize(formData.get("email")!.toString())
      : undefined;
    const type = sanitize(formData.get("type")?.toString() ?? "") as UserType;

    if (password && this.getPasswordStrength(password).variant === "WEAK") {
      alert("Your password must be longer!");
      return;
    }

    this.setState({ showSpinner: true });
    this.userService.feedModifyRequest({
      user_id: this.props.user?.getUserID(),
      username,
      email,
      type,
      password,
    });
  };

  readonly onUsernameChange = (event: ChangeEvent) => {
    this.setState({
      username: sanitize((event.target as HTMLInputElement).value),
    });
  };

  readonly onEmailChange = (event: ChangeEvent) => {
    this.setState({
      email: sanitize((event.target as HTMLInputElement).value),
    });
  };

  readonly onPasswordChange = (event: ChangeEvent) => {
    this.setState({
      password: sanitize((event.target as HTMLInputElement).value),
    });
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

  get promotions() {
    if (!this.props.user || this.props.user.getUserType() === UserType.INNER) {
      return [UserType.INNER, UserType.STAFF, UserType.ADMIN];
    }

    if (this.props.user.getUserType() === UserType.STAFF) {
      return [UserType.STAFF, UserType.ADMIN];
    }

    return [UserType.ADMIN];
  }
}
