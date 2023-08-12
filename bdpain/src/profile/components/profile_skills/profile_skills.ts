import { Component } from "react";
import {
  ProfileSkillsController,
  ProfileSkillsProps,
  ProfileSkillsState,
} from "./profile_skills_interface";
import { template } from "./profile_skills_template";

export class ProfileSkills
  extends Component<ProfileSkillsProps, ProfileSkillsState>
  implements ProfileSkillsController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileSkillsProps) {
    super(props);
  }
}