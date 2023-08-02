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
    this.state = { skills: props.skills?.slice(0, 10) ?? [] };
  }

  readonly skillsFormat = (skill: string) => {
    return skill.slice(0, 30);
  };
}
