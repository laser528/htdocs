import { Component } from "react";
import { template } from "./stats_template";
import { StatsProps, StatsController, StatsState } from "./stats_interface";
import { AdminService } from "../../services/admin_service";

export class Stats
  extends Component<StatsProps, StatsState>
  implements StatsController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribeInfoResponse = () => {};
  private clearInfoRefreshInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: StatsProps) {
    super(props);
    this.state = { info: undefined };
  }

  componentDidMount(): void {
    document.addEventListener("beforeunload", this.cleanup);

    this.unsubscribeInfoResponse = this.adminService.onInfoResponse(
      (response) => {
        if (response.success) this.setState({ info: response.info });
      }
    );

    this.clearInfoRefreshInterval = window.setInterval(() => {
      this.adminService.feedInfo();
    }, 120000);

    this.adminService.feedInfo();
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeInfoResponse();
    window.clearInterval(this.clearInfoRefreshInterval);
  };
}
