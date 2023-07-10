import { Component } from "react";
import { template } from "./password_checker_template";
import {
  PasswordCheckerProps,
  PasswordCheckerController,
  PasswordCheckerState,
} from "./password_checker_interface";

export class PasswordChecker
  extends Component<PasswordCheckerProps, PasswordCheckerState>
  implements PasswordCheckerController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: PasswordCheckerProps) {
    super(props);
  }
}
