import { Component } from "react";
import { template } from "./landing_template";
import {
  LandingProps,
  LandingController,
  LandingState,
} from "./landing_interface";

export class Landing
  extends Component<LandingProps, LandingState>
  implements LandingController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: LandingProps) {
    super(props);
  }
}
