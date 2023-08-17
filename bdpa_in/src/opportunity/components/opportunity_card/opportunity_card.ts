import { Component } from "react";
import { template } from "./opportunity_card_template";
import {
  OpportunityCardProps,
  OpportunityCardController,
  OpportunityCardState,
} from "./opportunity_card_interface";

export class OpportunityCard
  extends Component<OpportunityCardProps, OpportunityCardState>
  implements OpportunityCardController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityCardProps) {
    super(props);
    this.state = { activeViews: 0 };
  }
}
