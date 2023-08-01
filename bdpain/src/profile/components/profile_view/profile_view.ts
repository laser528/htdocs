import { Component } from "react";
import {
  ProfileViewController,
  ProfileViewProps,
  ProfileViewState,
} from "./profile_view_interface";
import { template } from "./profile_view_template";

export class ProfileView
  extends Component<ProfileViewProps, ProfileViewState>
  implements ProfileViewController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileViewProps) {
    super(props);
  }
}