import { Component } from "react";
import { template } from "./force_logout_template";
import {
  ForceLogoutProps,
  ForceLogoutController,
  ForceLogoutState,
} from "./force_logout_interface";

export class ForceLogout
  extends Component<ForceLogoutProps, ForceLogoutState>
  implements ForceLogoutController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ForceLogoutProps) {
    super(props);
  }
}
