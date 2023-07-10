import { Component } from "react";
import { template } from "./navbar_template";
import { NavbarProps, NavbarController, NavbarState } from "./navbar_interface";

export class Navbar
  extends Component<NavbarProps, NavbarState>
  implements NavbarController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: NavbarProps) {
    super(props);
  }
}
