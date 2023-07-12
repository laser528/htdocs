import { Component } from "react";
import { template } from "./navbar_template";
import { NavbarProps, NavbarController, NavbarState } from "./navbar_interface";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";

class Navbar
  extends Component<WithRouterProps<NavbarProps>, NavbarState>
  implements NavbarController
{
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
}

export default withRouting<NavbarProps>(Navbar);
