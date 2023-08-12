import { Component } from "react";
import {
  ProfileAboutController,
  ProfileAboutProps,
  ProfileAboutState,
} from "./profile_about_interface";
import { template } from "./profile_about_template";

export class ProfileAbout
  extends Component<ProfileAboutProps, ProfileAboutState>
  implements ProfileAboutController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileAboutProps) {
    super(props);
  }
}