import { Component, MouseEvent, KeyboardEvent } from "react";
import { template } from "./auth_template";
import {
  AuthProps,
  AuthController,
  AuthState,
  AuthType,
} from "./auth_interface";

export class Auth
  extends Component<AuthProps, AuthState>
  implements AuthController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: AuthProps) {
    super(props);
    this.state = {
      type: props.type ?? AuthType.LOGIN,
      errorMessage: undefined,
    };
  }

  readonly handleButtonClick = (event: MouseEvent | KeyboardEvent) => {
    event.preventDefault();

    this.setState({
      type:
        this.state.type === AuthType.LOGIN ? AuthType.REGISTER : AuthType.LOGIN,
      errorMessage: undefined,
    });
  };

  readonly onError = (error: string) => {
    this.setState({ errorMessage: error });
  };

  readonly handleAlertClose = () => {
    this.setState({ errorMessage: undefined });
  };
}
