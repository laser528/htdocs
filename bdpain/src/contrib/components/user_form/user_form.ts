import { Component } from "react";
import { template } from "./user_form_template";
import {
  UserFormProps,
  UserFormController,
  UserFormState,
} from "./user_form_interface";

export class UserForm
  extends Component<UserFormProps, UserFormState>
  implements UserFormController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: UserFormProps) {
    super(props);
  }
}
