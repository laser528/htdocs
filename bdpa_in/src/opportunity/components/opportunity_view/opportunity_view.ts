import { ChangeEvent, Component, FormEvent, MouseEvent } from "react";
import { template } from "./opportunity_view_template";
import {
  OpportunityViewProps,
  OpportunityViewController,
  OpportunityViewState,
} from "./opportunity_view_interface";
import { OpportunityService } from "../../services/opportunity_service";
import { sanitize } from "isomorphic-dompurify";
import { AppUserService } from "../../../contrib/services/app_user_service";

export class OpportunityView
  extends Component<OpportunityViewProps, OpportunityViewState>
  implements OpportunityViewController
{
  private readonly opportunityService = OpportunityService.getInstance();
  private readonly appUserService = AppUserService.getInstance();
  private unsubscribeFetchResponse = () => {};
  private unsubscribeModifyResponse = () => {};
  private unsubscribeDeleteResponse = () => {};
  private unsubscribeSessionResponse = () => {};
  private clearRefreshInterval = -1;
  private clearSessionInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityViewProps) {
    super(props);
    this.state = {
      opportunity: undefined,
      session_id: undefined,
      showEditModal: false,
      canModifyOpportunity: false,
      showEditSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeSessionResponse = this.opportunityService.onSessionResponse(
      (response) => {
        if (response.session_id) {
          this.setState({ session_id: response.session_id });
        }
      }
    );

    // Refresh Session every thirty seconds.
    this.clearSessionInterval = window.setInterval(() => {
      if (!this.state.opportunity) return;
      this.opportunityService.feedSession({
        session_id: this.state.session_id,
        opportunity_id: this.state.opportunity.opportunity_id,
      });
    }, 30000);

    this.unsubscribeFetchResponse = this.opportunityService.onFetchResponse(
      (response) => {
        if (!response.success) {
          const error: string = response.error;
          if (error.includes(this.props.id)) {
            alert(`Opportunity ${this.props.id} Doesn't Exist`);
            window.location.href = "/opportunities";
            return;
          }

          alert(`${error}. Please Refresh`);
          return;
        }

        this.setState({
          opportunity: response.opportunity,
          canModifyOpportunity:
            this.appUserService.getUserID() === response.opportunity.creator_id,
        });
      }
    );

    this.unsubscribeModifyResponse = this.opportunityService.onModifyResponse(
      (response) => {
        if (this.state.showEditSpinner) {
          this.setState({ showEditSpinner: false });
        }

        if (!response.success) {
          const error: string = response.error;
          if (error.includes(this.props.id)) {
            alert(`Opportunity ${this.props.id} Doesn't Exist`);
            window.location.href = "/opportunities";
            return;
          }

          alert(`${error}. Please Refresh`);
          return;
        }

        this.setState({
          opportunity: response.opportunity,
          canModifyOpportunity:
            this.appUserService.getUserID() === response.opportunity.creator_id,
          showEditModal: false,
        });
      }
    );

    this.unsubscribeDeleteResponse = this.opportunityService.onDeleteResponse(
      (response) => {
        if (!response.success) {
          const error: string = response.error;
          if (error.includes(this.props.id)) {
            alert(`Opportunity ${this.props.id} Doesn't Exist`);
            window.location.href = "/opportunities";
            return;
          }

          alert(`${error}. Please Refresh`);
          return;
        }

        alert("Opportunity Successfully Deleted!");
        window.location.href = "/opportunities";
      }
    );

    // Refresh content every 2 minutes.
    this.clearRefreshInterval = window.setInterval(() => {
      this.opportunityService.feedFetch({ opportunity_id: this.props.id });
    }, 120000);

    this.clearSessionInterval = window.setInterval(() => {
      if (!this.state.opportunity) return;
      this.opportunityService.feedSession({
        session_id: this.state.session_id,
        opportunity_id: this.state.opportunity.opportunity_id,
      });
    }, 30000);

    this.opportunityService.feedFetch({ opportunity_id: this.props.id });
    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearRefreshInterval);
    window.clearInterval(this.clearSessionInterval);
    this.unsubscribeFetchResponse();
    this.unsubscribeDeleteResponse();
    this.unsubscribeModifyResponse();
    this.unsubscribeSessionResponse();
    this.opportunityService.feedSession({
      session_id: this.state.session_id,
      opportunity_id: this.props.id,
      destroy: true,
    });
  };

  readonly onEditButtonClick = (event: MouseEvent) => {
    this.setState({
      showEditModal: true,
      modalTitle: this.state.opportunity?.title ?? "",
      modalContents: this.state.opportunity?.contents ?? "",
    });
  };

  readonly onDeleteButtonClick = (event: MouseEvent) => {
    if (window.confirm("Are You Sure?")) {
      this.opportunityService.feedDelete({
        opportunity_id: this.props.id,
      });
      window.location.href = "/opportunities";
    }
  };

  readonly onEditModalClose = () => {
    this.setState({ showEditModal: false });
  };

  readonly handleEditSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = sanitize(formData.get("title")?.toString() ?? "");
    const contents = sanitize(formData.get("contents")?.toString() ?? "");

    this.setState({ showEditSpinner: true });
    this.opportunityService.feedModify({
      opportunity_id: this.props.id,
      title,
      contents,
    });
  };

  readonly onModalTitleChange = (event: ChangeEvent) => {
    const modalTitle = sanitize((event.target as HTMLInputElement).value);
    this.setState({ modalTitle });
  };

  readonly onModalContentsChange = (event: ChangeEvent) => {
    const modalContents = (event.target as HTMLInputElement).value;
    this.setState({ modalContents });
  };
}
