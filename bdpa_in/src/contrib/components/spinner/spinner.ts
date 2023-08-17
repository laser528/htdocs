import { Component } from "react";
import { template } from "./spinner_template";
import {
  SpinnerProps,
  SpinnerController,
  SpinnerState,
} from "./spinner_interface";

export class Spinner
  extends Component<SpinnerProps, SpinnerState>
  implements SpinnerController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: SpinnerProps) {
    super(props);
  }
}
