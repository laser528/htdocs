import { Component, MouseEvent } from "react";
import { template } from "./navbar_template";
import { NavbarProps, NavbarController, NavbarState } from "./navbar_interface";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";
import { UserService } from "../../../contrib/user/services/user_service/user_service";
import { AuthenticationService } from "../../../auth/services/authentication_service";

class Navbar
  extends Component<WithRouterProps<NavbarProps>, NavbarState>
  implements NavbarController
{
  private readonly userService = UserService.getInstance();
  private readonly authenticationService = AuthenticationService.getInstance();
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
    return this.userService.getUrl();
  }

  get userType() {
    return this.userService.getUserType();
  }

  get emailHash() {
    return this.userService.getUserEmailHash();
  }

  get isImpersonating() {
    return !!this.userService.getImpersonator();
  }

  readonly logout = (event: MouseEvent) => {
    this.authenticationService.logout();
    this.props.navigate("/");
  };

  readonly stopImpersonating = (event: MouseEvent) => {
    this.userService.removeImpersonator();
    this.props.navigate("/admin");
  };
}

export default withRouting<NavbarProps>(Navbar);
