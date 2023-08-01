import { Component } from "react";
import { template } from "./modify_users_template";
import {
  ModifyUsersProps,
  ModifyUsersController,
  ModifyUsersState,
} from "./modify_users_interface";

export class ModifyUsers
  extends Component<ModifyUsersProps, ModifyUsersState>
  implements ModifyUsersController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ModifyUsersProps) {
    super(props);
  }
}
