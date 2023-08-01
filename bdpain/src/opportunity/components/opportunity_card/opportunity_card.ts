import { Component } from "react";
import { template } from "./opportunity_card_template";
import {
  OpportunityCardProps,
  OpportunityCardController,
  OpportunityCardState,
} from "./opportunity_card_interface";
import { SessionService } from "../../../contrib/services/session/session_service";

export class OpportunityCard
  extends Component<OpportunityCardProps, OpportunityCardState>
  implements OpportunityCardController
{
  private readonly sessionService = SessionService.getInstance();
  private unsubscribeCount = () => {};
  private clearInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityCardProps) {
    super(props);
    this.state = { activeViews: 0 };
  }

  componentDidMount(): void {
    window.addEventListener("beforeunload", this.cleanup);
    this.unsubscribeCount = this.sessionService.onSessionCountSuccess(
      (response) => {
        if (
          response.success &&
          response.key === this.props.opportunity.opportunity_id
        ) {
          this.setState({ activeViews: response.active });
        }
      }
    );

    this.updateActiveCount();
    this.clearInterval = window.setInterval(this.updateActiveCount, 60000);
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeCount();
    window.clearInterval(this.clearInterval);
  };

  private readonly updateActiveCount = () => {
    this.sessionService.feedCountSession({
      type: "opportunity",
      id: this.props.opportunity.opportunity_id,
      key: this.props.opportunity.opportunity_id,
    });
  };
}
