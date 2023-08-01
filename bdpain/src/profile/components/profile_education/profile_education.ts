import { Component } from "react";
import {
  ProfileEducationController,
  ProfileEducationProps,
  ProfileEducationState,
} from "./profile_education_interface";
import { template } from "./profile_education_template";

export class ProfileEducation
  extends Component<ProfileEducationProps, ProfileEducationState>
  implements ProfileEducationController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileEducationProps) {
    super(props);
  }
}