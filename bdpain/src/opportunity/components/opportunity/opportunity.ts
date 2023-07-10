import { Component } from "react";
import { template } from "./opportunity_template";
import {
  OpportunityProps,
  OpportunityController,
  OpportunityState,
} from "./opportunity_interface";

export class Opportunity
  extends Component<OpportunityProps, OpportunityState>
  implements OpportunityController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityProps) {
    super(props);
  }
}
