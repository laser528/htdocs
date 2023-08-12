import { Component } from "react";
import {
  ProfileExperienceController,
  ProfileExperienceProps,
  ProfileExperienceState,
} from "./profile_experience_interface";
import { template } from "./profile_experience_template";

export class ProfileExperience
  extends Component<ProfileExperienceProps, ProfileExperienceState>
  implements ProfileExperienceController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileExperienceProps) {
    super(props);
  }
}