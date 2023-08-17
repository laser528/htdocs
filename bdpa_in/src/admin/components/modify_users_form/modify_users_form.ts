import { ChangeEvent, Component, FormEvent } from "react";
import { sanitize } from "isomorphic-dompurify";
import { template } from "./modify_users_form_template";
import {
  ModifyUsersFormProps,
  ModifyUsersFormController,
  ModifyUsersFormState,
} from "./modify_users_form_interface";
import { AdminService } from "../../services/admin_service";
import { UserType } from "../../../contrib/lib";

export class ModifyUsersForm
  extends Component<ModifyUsersFormProps, ModifyUsersFormState>
  implements ModifyUsersFormController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribeAddUserResponse = () => {};
  private unsubscribePromoteResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ModifyUsersFormProps) {
    super(props);
    this.state = {
      username: props.user?.username ?? "",
      email: props.user?.email ?? "",
      password: "",
      showSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeAddUserResponse = this.adminService.onAddUserResponse(
      (response) => {
        this.setState({ showSpinner: false });
        if (response.error) {
          alert(response.error);
          return;
        }

        alert(`User Successfully Created!`);
        this.props.onComplete?.();
      }
    );

    this.unsubscribePromoteResponse = this.adminService.onPromoteResponse(
      (response) => {
        if (!this.props.user) return;

        this.setState({ showSpinner: false });
        if (response.error) {
          alert(response.error);
          return;
        }

        alert(`User ${this.props.user?.username} Successfully Promoted!`);
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
        username: this.props.user?.username ?? "",
        email: this.props.user?.email ?? "",
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
    this.unsubscribeAddUserResponse();
    this.unsubscribePromoteResponse();
  };

  readonly onModifyFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const username = !!formData.get("username")
      ? sanitize(formData.get("username")!.toString())
      : "";
    const password = !!formData.get("password")
      ? sanitize(formData.get("password")!.toString())
      : "";
    const email = !!formData.get("email")
      ? sanitize(formData.get("email")!.toString())
      : "";
    const type = sanitize(formData.get("type")?.toString() ?? "") as UserType;

    if (password && this.getPasswordStrength(password).variant === "WEAK") {
      alert("Your password must be longer!");
      return;
    }

    this.setState({ showSpinner: true });

    if (!!this.props.user) {
      this.adminService.feedPromote({
        name_or_id: this.props.user?.user_id,
        type,
      });
    } else {
      this.adminService.feedAddUser({
        username,
        email,
        type,
        password,
      });
    }
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
    if (!this.props.user || this.props.user.type === UserType.INNER) {
      return [UserType.INNER, UserType.STAFF, UserType.ADMINISTRATOR];
    }

    if (this.props.user.type === UserType.STAFF) {
      return [UserType.STAFF, UserType.ADMINISTRATOR];
    }

    return [UserType.ADMINISTRATOR];
  }
}
