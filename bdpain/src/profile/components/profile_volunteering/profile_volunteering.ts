import { Component } from "react";
import {
  ProfileVolunteeringController,
  ProfileVolunteeringProps,
  ProfileVolunteeringState,
} from "./profile_volunteering_interface";
import { template } from "./profile_volunteering_template";

export class ProfileVolunteering
  extends Component<ProfileVolunteeringProps, ProfileVolunteeringState>
  implements ProfileVolunteeringController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileVolunteeringProps) {
    super(props);
  }
}