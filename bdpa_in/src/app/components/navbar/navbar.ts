import { Component, MouseEvent } from "react";
import { template } from "./navbar_template";
import { NavbarProps, NavbarController, NavbarState } from "./navbar_interface";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";
import { AppUserService } from "../../../contrib/services/app_user_service";
import { AuthService } from "../../../auth/services/auth_service";

class Navbar
  extends Component<WithRouterProps<NavbarProps>, NavbarState>
  implements NavbarController
{
  private readonly appUserService = AppUserService.getInstance();
  private readonly authService = AuthService.getInstance();
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<NavbarProps>) {
    super(props);
    this.state = { location: props.location };
  }

  componentDidMount(): void {
    this.didMountOrUpdate();
  }

  componentDidUpdate(
    prevProps: Readonly<WithRouterProps<NavbarProps>>,
    prevState: Readonly<NavbarState>,
    snapshot?: any
  ): void {
    this.didMountOrUpdate();
  }

  private didMountOrUpdate() {
    if (this.props.location !== this.state.location) {
      this.setState({ location: this.props.location });
    }
  }

  get url() {
    return this.appUserService.getUrl();
  }

  get userType() {
    return this.appUserService.getUserType();
  }

  get emailHash() {
    return this.appUserService.getUserEmailHash();
  }

  get isImpersonating() {
    return this.appUserService.isImpersonating();
  }

  readonly logout = (event: MouseEvent) => {
    this.authService.logout();
    this.props.navigate("/");
  };

  readonly stopImpersonating = (event: MouseEvent) => {
    this.appUserService.removeImpersonatingUser();
    this.props.navigate("/admin");
  };
}

export default withRouting<NavbarProps>(Navbar);
