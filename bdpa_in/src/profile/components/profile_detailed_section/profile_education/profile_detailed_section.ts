import { Component } from "react";
import {
  ProfileDetailedSectionController,
  ProfileDetailedSectionProps,
  ProfileDetailedSectionState,
} from "./profile_detailed_section_interface";
import { template } from "./profile_detailed_section_template";

export class ProfileDetailedSection
  extends Component<ProfileDetailedSectionProps, ProfileDetailedSectionState>
  implements ProfileDetailedSectionController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileDetailedSectionProps) {
    super(props);
    this.state = {
      section: props.section?.slice(0, 10) ?? [],
      title: "",
      startedAt: "",
      location: "",
      description: "",
    };
  }

  readonly descriptionFormat = (description: string) => {
    return description.slice(0, 250);
  };

  readonly titleFormat = (title: string) => {
    return title.slice(0, 100);
  };

  readonly dateFormat = (dateMs?: number) => {
    if (!dateMs || dateMs === null) return "Current";

    const date = new Date(Number(dateMs));
    return (
      date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + +date.getDate()
    );
  };

  readonly locationFormat = (location: string) => {
    return location.slice(0, 30);
  };
}
