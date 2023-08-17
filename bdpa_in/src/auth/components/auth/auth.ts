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
import { AuthService } from "../../services/auth_service";

export class Auth
  extends Component<WithRouterProps<AuthProps>, AuthState>
  implements AuthController
{
  private readonly authService = AuthService.getInstance();
  private unsubscribeSessionResponse = () => {};
  private clearSessionInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<AuthProps>) {
    super(props);
    this.state = {
      type: props.type ?? AuthType.LOGIN,
      session_id: undefined,
    };
  }

  componentDidMount(): void {
    this.unsubscribeSessionResponse = this.authService.onSessionResponse(
      (response) => {
        if (response.session_id) {
          this.setState({ session_id: response.session_id });
        }
      }
    );

    // Refresh Session every thirty seconds.
    this.authService.feedSession({});
    this.clearSessionInterval = window.setInterval(() => {
      this.authService.feedSession({ session_id: this.state.session_id });
    }, 30000);

    window.addEventListener("beforeunload", this.cleanup);
    this.didMountOrUpdate();
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearSessionInterval);
    this.unsubscribeSessionResponse();

    this.authService.feedSession({
      session_id: this.state.session_id,
      destroy: true,
    });
  };

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
    });
  };

  get forgotPasswordId() {
    return this.props.params.security;
  }
}

export default withRouting<AuthProps>(Auth);
