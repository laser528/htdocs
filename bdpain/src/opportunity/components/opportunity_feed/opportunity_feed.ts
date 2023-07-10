import { Component } from "react";
import { template } from "./opportunity_feed_template";
import {
  OpportunityFeedProps,
  OpportunityFeedController,
  OpportunityFeedState,
} from "./opportunity_feed_interface";

export class OpportunityFeed
  extends Component<OpportunityFeedProps, OpportunityFeedState>
  implements OpportunityFeedController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityFeedProps) {
    super(props);
  }
}
