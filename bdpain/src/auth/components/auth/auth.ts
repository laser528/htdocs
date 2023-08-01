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
import { SessionService } from "../../../contrib/services/session/session_service";
import { SessionType } from "../../../contrib/services/session/lib";

export class Auth
  extends Component<WithRouterProps<AuthProps>, AuthState>
  implements AuthController
{
  private readonly sessionService = SessionService.getInstance();
  private unsubscribeSessionCreate = () => {};
  private unsubscribeSessionRefresh = () => {};
  private clearRefreshTimeout = -1;
  private sessionId = "";
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<AuthProps>) {
    super(props);
    this.state = {
      type: props.type ?? AuthType.LOGIN,
      errorMessage: undefined,
    };
  }

  componentDidMount(): void {
    this.unsubscribeSessionCreate = this.sessionService.onSessionCreateSuccess(
      (response) => {
        if (response.session_id) this.sessionId = response.session_id;
      }
    );

    this.unsubscribeSessionRefresh =
      this.sessionService.onSessionRefreshSuccess((response) => {});

    this.clearRefreshTimeout = window.setInterval(() => {
      if (this.sessionId) {
        this.sessionService.feedRefreshSession({
          session_id: this.sessionId,
          destroy: false,
        });
      }
    }, 30000);

    this.sessionService.feedCreateSession({
      view: SessionType.AUTH,
    });

    document.addEventListener("beforeunload", this.cleanup);
    this.didMountOrUpdate();
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeSessionCreate();
    this.unsubscribeSessionRefresh();
    window.clearTimeout(this.clearRefreshTimeout);

    this.sessionService.feedRefreshSession({
      session_id: this.sessionId,
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
