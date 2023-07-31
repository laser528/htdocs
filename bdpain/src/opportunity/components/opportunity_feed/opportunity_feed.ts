import { Component } from "react";
import { template } from "./opportunity_feed_template";
import { OpportunityService } from "../../services/opportunity_service";
import {
  OpportunityFeedProps,
  OpportunityFeedController,
  OpportunityFeedState,
} from "./opportunity_feed_interface";

export class OpportunityFeed
  extends Component<OpportunityFeedProps, OpportunityFeedState>
  implements OpportunityFeedController
{
  private readonly opportunityService = OpportunityService.getInstance();
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityFeedProps) {
    super(props);
    this.state = { opportunities: [] };
  }

  componentDidMount(): void {
    this.fetchFeed();
  }

  get hasMoreItems() {
    return this.state.opportunities.length % 100 === 0;
  }

  readonly fetchFeed = async () => {
    let after = undefined;
    if (this.state.opportunities.length) {
      after =
        this.state.opportunities[this.state.opportunities.length - 1]
          .opportunity_id;
    }

    const response = await this.opportunityService.getFeed(after);
    if (response.opportunities) {
      this.setState({
        opportunities: this.state.opportunities.concat(response.opportunities),
      });
    }
  };
}
