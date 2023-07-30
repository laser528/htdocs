import { Component, MouseEvent } from "react";
import { template } from "./navbar_template";
import { NavbarProps, NavbarController, NavbarState } from "./navbar_interface";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";
import { UserType } from "../../../contrib/services/user/lib";
import { AppUser } from "../../../contrib/services/user/app_user";

class Navbar
  extends Component<WithRouterProps<NavbarProps>, NavbarState>
  implements NavbarController
{
  private readonly appUser = AppUser.getInstance();
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
    return this.appUser.getUrl();
  }

  get userType() {
    return this.appUser.getUserType();
  }

  get emailHash() {
    return this.appUser.getUserEmailHash();
  }

  get isImpersonating() {
    return !!this.appUser.getImpersonatingUser();
  }

  readonly logout = (event: MouseEvent) => {
    console.log("Logging Out");
  };

  readonly stopImpersonating = (event: MouseEvent) => {
    this.appUser.removeImpersonatingUser();
    this.props.navigate("/admin");
  };
}

export default withRouting<NavbarProps>(Navbar);
