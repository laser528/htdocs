import { ChangeEvent, Component, FormEvent, MouseEvent } from "react";
import { template } from "./opportunity_view_template";
import {
  OpportunityViewProps,
  OpportunityViewController,
  OpportunityViewState,
} from "./opportunity_view_interface";
import { OpportunityService } from "../../services/opportunity_service";
import { SessionService } from "../../../contrib/services/session/session_service";
import { SessionType } from "../../../contrib/services/session/lib";
import { AppUser } from "../../../contrib/services/user/app_user";
import { sanitize } from "isomorphic-dompurify";

export class OpportunityView
  extends Component<OpportunityViewProps, OpportunityViewState>
  implements OpportunityViewController
{
  private readonly opportunityService = OpportunityService.getInstance();
  private readonly appUser = AppUser.getInstance();
  private readonly sessionService = SessionService.getInstance();
  private sessionId = "";
  private unsubscribeSessionCount = () => {};
  private unsubscribeSessionCreate = () => {};
  private unsubscribeSessionRefresh = () => {};
  private unsubscribeOpportunity = () => {};
  private unsubscribeManageOpportunity = () => {};
  private clearOpportunityRefreshInterval = -1;
  private clearSessionRefreshInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityViewProps) {
    super(props);
    this.state = {
      opportunity: undefined,
      showEditModal: false,
      canModifyOpportunity: false,
      showEditSpinner: false,
    };
  }

  componentDidMount(): void {
    this.unsubscribeSessionCount = this.sessionService.onSessionCountSuccess(
      (response) => {
        if (response.success) this.setState({ activeViewers: response.active });
      }
    );

    this.unsubscribeSessionCreate = this.sessionService.onSessionCreateSuccess(
      (response) => {
        if (response.success) this.sessionId = response.session_id;
      }
    );

    this.unsubscribeSessionRefresh =
      this.sessionService.onSessionRefreshSuccess(() => {});

    this.unsubscribeOpportunity = this.opportunityService.onOpportunitySuccess(
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
            this.appUser.getUserID() === response.opportunity.creator_id,
        });
      }
    );

    this.unsubscribeManageOpportunity =
      this.opportunityService.onOpportunityManageSuccess((response) => {
        if (response.key !== this.props.id) return;

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
            this.appUser.getUserID() === response.opportunity.creator_id,
          showEditModal: false,
        });
      });

    // Refresh content every 2 minutes.
    this.clearOpportunityRefreshInterval = window.setInterval(
      this.loadOpportunity,
      120000
    );

    // Per requirements refresh every 30 secs.
    this.clearSessionRefreshInterval = window.setInterval(
      this.manageSession,
      30000
    );

    this.loadOpportunity(true);
    this.manageSession();
    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearOpportunityRefreshInterval);
    window.clearInterval(this.clearSessionRefreshInterval);
    this.unsubscribeManageOpportunity();
    this.unsubscribeOpportunity();
    this.unsubscribeSessionCount();
    this.unsubscribeSessionCreate();
    this.unsubscribeSessionRefresh();

    if (this.sessionId) {
      this.sessionService.feedRefreshSession({
        session_id: this.sessionId,
        destroy: true,
      });
    }
  };

  private loadOpportunity = (mount = false) => {
    if (mount) {
      this.opportunityService.feedManageOpportunity({
        opportunity_id: this.props.id,
        views: "increment",
        key: this.props.id,
      });
    } else {
      this.opportunityService.feedOpportunity({
        opportunity_id: this.props.id,
      });
    }

    this.sessionService.feedCountSession({
      type: "opportunity",
      id: this.props.id,
      key: this.props.id,
    });
  };

  private readonly manageSession = () => {
    if (!this.sessionId) {
      this.sessionService.feedCreateSession({
        view: SessionType.OPPORTUNITY,
        viewed_id: this.props.id,
      });
    } else {
      this.sessionService.feedRefreshSession({
        session_id: this.sessionId,
        destroy: false,
      });
    }
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
      this.opportunityService.feedManageOpportunity({
        destroy: true,
        opportunity_id: this.props.id,
        key: this.props.id,
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
    const contents = sanitize(formData.get("contents")?.toString() ?? "", {
      USE_PROFILES: { html: true },
    });

    this.setState({ showEditSpinner: true });
    this.opportunityService.feedManageOpportunity({
      opportunity_id: this.props.id,
      title,
      contents,
      key: this.props.id,
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
