import { Component } from "react";
import { template } from "./opportunity_view_template";
import {
  OpportunityViewProps,
  OpportunityViewController,
  OpportunityViewState,
} from "./opportunity_view_interface";

export class OpportunityView
  extends Component<OpportunityViewProps, OpportunityViewState>
  implements OpportunityViewController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityViewProps) {
    super(props);
  }
}
