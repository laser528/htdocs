import { Component } from "react";
import { template } from "./app_template";
import { AppProps, AppController, AppState, AppTheme } from "./app_interface";
import { AuthService } from "../../../auth/services/auth_service";
import { AppUserService } from "../../../contrib/services/app_user_service";
import { LocalStorage } from "../../../contrib/services/storage_service";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";
import { AppService } from "../../services/app_service";

export class App
  extends Component<WithRouterProps<AppProps>, AppState>
  implements AppController
{
  private readonly appService = AppService.getInstance();
  private readonly authService = AuthService.getInstance();
  private readonly appUserService = AppUserService.getInstance();
  private unsubscribeSyncResponse = () => {};
  private clearSyncInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<AppProps>) {
    super(props);

    const theme = (LocalStorage.getItem("theme") as AppTheme) ?? AppTheme.LIGHT;
    this.state = { theme };
  }

  componentDidMount(): void {
    this.unsubscribeSyncResponse = this.appService.onSyncResponse(
      (response) => {
        console.log(response);
      }
    );

    // Refresh App every two minutes.
    this.clearSyncInterval = window.setInterval(async () => {
      this.appService.feedSync();
    }, 120000);

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearSyncInterval);
    this.unsubscribeSyncResponse();
  };

  readonly onThemeChange = (theme: AppTheme) => {
    if (theme === this.state.theme) return;

    LocalStorage.setItem("theme", theme);
    this.setState({ theme });
  };

  get isLoggedIn() {
    return this.authService.isLoggedIn();
  }

  get url() {
    return this.appUserService.getUrl();
  }

  get userType() {
    return this.appUserService.getUserType();
  }
}

export default withRouting<AppProps>(App);
