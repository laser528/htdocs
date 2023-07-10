import { Component } from "react";
import { template } from "./login_form_template";
import {
  LoginFormProps,
  LoginFormController,
  LoginFormState,
} from "./login_form_interface";

export class LoginForm
  extends Component<LoginFormProps, LoginFormState>
  implements LoginFormController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: LoginFormProps) {
    super(props);
  }
}
