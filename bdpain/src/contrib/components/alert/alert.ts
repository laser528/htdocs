import { Component } from "react";
import { template } from "./alert_template";
import { AlertProps, AlertController, AlertState } from "./alert_interface";

export class Alert
  extends Component<AlertProps, AlertState>
  implements AlertController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: AlertProps) {
    super(props);
  }
}
