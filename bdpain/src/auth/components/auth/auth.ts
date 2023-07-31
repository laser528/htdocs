import { Component, MouseEvent, KeyboardEvent } from "react";
import { template } from "./auth_template";
import {
  AuthProps,
  AuthController,
  AuthState,
  AuthType,
} from "./auth_interface";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";

export class Auth
  extends Component<WithRouterProps<AuthProps>, AuthState>
  implements AuthController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<AuthProps>) {
    super(props);
    this.state = {
      type: props.type ?? AuthType.LOGIN,
      errorMessage: undefined,
    };
  }

  componentDidMount(): void {
    this.didMountOrUpdate();
  }

  componentDidUpdate(
    prevProps: Readonly<WithRouterProps<AuthProps>>,
    prevState: Readonly<WithRouterProps<AuthState>>,
    snapshot?: any
  ): void {
    this.didMountOrUpdate();
  }

  private didMountOrUpdate() {
    if (this.props.type !== this.state.type) {
      this.setState({ type: this.props.type ?? AuthType.LOGIN });
    }
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

  get forgotPasswordId() {
    return this.props.params.security;
  }
}

export default withRouting<AuthProps>(Auth);
