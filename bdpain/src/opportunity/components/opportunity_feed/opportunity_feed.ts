import { Component, FormEvent, MouseEvent } from "react";
import { template } from "./opportunity_feed_template";
import { OpportunityService } from "../../services/opportunity_service";
import { sanitize } from "isomorphic-dompurify";
import {
  OpportunityFeedProps,
  OpportunityFeedController,
  OpportunityFeedState,
} from "./opportunity_feed_interface";
import { AppUser } from "../../../contrib/services/user/app_user";
import { UserType } from "../../../contrib/services/user/lib";

export class OpportunityFeed
  extends Component<OpportunityFeedProps, OpportunityFeedState>
  implements OpportunityFeedController
{
  private readonly opportunityService = OpportunityService.getInstance();
  private readonly appUser = AppUser.getInstance();
  private unsubscribeOpportunityFeed = () => {};
  private unsubscribeManageOpportunity = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityFeedProps) {
    super(props);
    this.state = {
      opportunities: [],
      hasMoreItems: true,
      canAddOpportunity: this.appUser.getUserType() === UserType.STAFF,
      showAddModal: false,
      showAddSpinner: false,
    };
  }

  componentDidMount(): void {
    window.addEventListener("beforeunload", this.cleanup);
    this.unsubscribeOpportunityFeed =
      this.opportunityService.onOpportunitySuccess((response) => {
        if (!response.success) {
          this.props.onError?.(response.error);
          return;
        }

        if (response.opportunities) {
          if (!response.opportunities.length) {
            this.setState({ hasMoreItems: false });
            return;
          }

          this.setState({
            opportunities: this.state.opportunities.concat(
              response.opportunities.slice(0, 5)
            ),
            hasMoreItems: true,
          });
        }
      });

    this.unsubscribeManageOpportunity =
      this.opportunityService.onOpportunityManageSuccess((response) => {
        this.setState({ showAddSpinner: false });

        if (response.error) {
          alert(response.error);
          return;
        }

        alert(`${response.opportunity.title} Successfully Created`);
        (document.getElementById("addForm") as HTMLFormElement).reset();
        this.setState({ opportunities: [] });
        this.onAddModalClose();
        this.fetchFeed();
      });

    this.fetchFeed();
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeOpportunityFeed();
    this.unsubscribeManageOpportunity();
  };

  readonly fetchFeed = () => {
    let after = undefined;
    if (this.state.opportunities.length) {
      after =
        this.state.opportunities[this.state.opportunities.length - 1]
          .opportunity_id;
    }

    this.opportunityService.feedOpportunity({
      after,
    });
  };

  readonly onAddButtonClick = (event: MouseEvent) => {
    this.setState({ showAddModal: true });
  };

  readonly onAddModalClose = () => {
    this.setState({ showAddModal: false });
  };

  readonly handleAddSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = sanitize(formData.get("title")?.toString() ?? "");
    const contents = sanitize(formData.get("contents")?.toString() ?? "");

    this.setState({ showAddSpinner: true });
    this.opportunityService.feedManageOpportunity({
      creator_id: this.appUser.getUserID(),
      title,
      contents,
      key: "add",
    });
  };
}
