import { Component } from "react";
import {
  ProfileTopController,
  ProfileTopProps,
  ProfileTopState,
} from "./profile_top_interface";
import { template } from "./profile_top_template";

export class ProfileTop
  extends Component<ProfileTopProps, ProfileTopState>
  implements ProfileTopController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileTopProps) {
    super(props);
  }
}