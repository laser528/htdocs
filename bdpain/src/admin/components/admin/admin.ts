import { Component } from "react";
import { template } from "./admin_template";
import { AdminProps, AdminController, AdminState } from "./admin_interface";

export class Admin
  extends Component<AdminProps, AdminState>
  implements AdminController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: AdminProps) {
    super(props);
  }
}
