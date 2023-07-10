import { Component } from "react";
import { template } from "./auth_template";
import { AuthProps, AuthController, AuthState } from "./auth_interface";

export class Auth
  extends Component<AuthProps, AuthState>
  implements AuthController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: AuthProps) {
    super(props);
  }
}
