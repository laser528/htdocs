import { Component } from "react";
import { template } from "./stats_template";
import { StatsProps, StatsController, StatsState } from "./stats_interface";

export class Stats
  extends Component<StatsProps, StatsState>
  implements StatsController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: StatsProps) {
    super(props);
  }
}
