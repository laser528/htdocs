import { Component, FormEvent, MouseEvent } from "react";
import { template } from "./opportunity_feed_template";
import { sanitize } from "isomorphic-dompurify";
import {
  OpportunityFeedProps,
  OpportunityFeedController,
  OpportunityFeedState,
} from "./opportunity_feed_interface";
import { UserType } from "../../../contrib/lib";
import { AppUserService } from "../../../contrib/services/app_user_service";
import { OpportunityService } from "../../services/opportunity_service";

export class OpportunityFeed
  extends Component<OpportunityFeedProps, OpportunityFeedState>
  implements OpportunityFeedController
{
  private readonly opportunityService = OpportunityService.getInstance();
  private readonly appUserService = AppUserService.getInstance();
  private unsubscribeFetchResponse = () => {};
  private unsubscribeAddResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityFeedProps) {
    super(props);
    this.state = {
      opportunities: [],
      opportunitiesSliced: [],
      hasMoreItems: true,
      canAddOpportunity: this.appUserService.getUserType() === UserType.STAFF,
      showAddModal: false,
      showAddSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeFetchResponse = this.opportunityService.onFetchResponse(
      (response) => {
        if (!response.success) {
          alert(response.error);
          return;
        }

        if (!response.opportunities.length) return;

        this.setState({
          opportunities: [...response.opportunities],
          opportunitiesSliced: response.opportunities.slice(0, 20),
        });
      }
    );

    this.unsubscribeAddResponse = this.opportunityService.onAddResponse(
      (response) => {
        this.setState({ showAddSpinner: false });

        if (response.error) {
          alert(response.error);
          return;
        }

        alert(`${response.opportunity.title} Successfully Created`);
        (document.getElementById("addForm") as HTMLFormElement).reset();
        this.setState({
          opportunities: [],
          opportunitiesSliced: [],
          hasMoreItems: true,
        });
        this.onAddModalClose();
        this.opportunityService.feedFetch({});
      }
    );

    this.opportunityService.feedFetch({});

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeFetchResponse();
    this.unsubscribeAddResponse();
  };

  readonly fetchFeed = () => {
    const length = this.state.opportunitiesSliced.length;
    const newLength = length + 20;
    this.setState({
      opportunitiesSliced: [
        ...this.state.opportunitiesSliced,
        ...this.state.opportunities.slice(length, newLength),
      ],
      hasMoreItems: newLength <= this.state.opportunities.length,
    });
  };

  readonly onAddButtonClick = (event: MouseEvent) => {
    this.setState({ showAddModal: true });
  };

  readonly onAddModalClose = () => {
    this.setState({
      showAddModal: false,
      opportunities: [],
      opportunitiesSliced: [],
      hasMoreItems: true,
    });
  };

  readonly handleAddSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = sanitize(formData.get("title")?.toString() ?? "");
    const contents = sanitize(formData.get("contents")?.toString() ?? "");

    this.setState({ showAddSpinner: true });
    this.opportunityService.feedAdd({
      creator_id: this.appUserService.getUserID()!,
      title,
      contents,
    });
  };
}
