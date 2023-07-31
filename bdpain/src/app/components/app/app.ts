import { Component } from "react";
import { template } from "./app_template";
import { AppProps, AppController, AppState, AppTheme } from "./app_interface";
import { NetworkService } from "../../../contrib/services/network/network_service";
import { AuthenticationService } from "../../../auth/services/authentication_service";
import { AppUser } from "../../../contrib/services/user/app_user";
import { firstValueFrom } from "rxjs";
import { LocalStorage } from "../../../contrib/services/storage/storage";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";

export class App
  extends Component<WithRouterProps<AppProps>, AppState>
  implements AppController
{
  private readonly authenticationService = AuthenticationService.getInstance();
  private readonly networkService = NetworkService.getInstance();
  private readonly appUser = AppUser.getInstance();
  private clearInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<AppProps>) {
    super(props);

    const theme = (LocalStorage.getItem("theme") as AppTheme) ?? AppTheme.LIGHT;
    this.state = { theme };
  }

  componentDidMount(): void {
    // Refresh App every two minutes.
    this.clearInterval = window.setInterval(async () => {
      const response = await firstValueFrom(
        this.networkService.fetch("refresh/update_app.php")
      );
      console.log(response);
    }, 120000);
  }

  componentWillUnmount(): void {
    window.clearInterval(this.clearInterval);
  }

  readonly onThemeChange = (theme: AppTheme) => {
    if (theme === this.state.theme) return;

    LocalStorage.setItem("theme", theme);
    this.setState({ theme });
  };

  get isLoggedIn() {
    return this.authenticationService.isLoggedIn();
  }

  get url() {
    return this.appUser.getUrl();
  }

  get userType() {
    return this.appUser.getUserType();
  }
}

export default withRouting<AppProps>(App);
