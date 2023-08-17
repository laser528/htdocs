import { Component } from "react";
import { HomeController, HomeProps, HomeState } from "./home_interface";
import { template } from "./home_template";
import { HomeService } from "../../services/home_service";

export class Home
  extends Component<HomeProps, HomeState>
  implements HomeController
{
  private readonly homeService = HomeService.getInstance();
  private unsubscribeSessionResponse = () => {};
  private clearSessionInterval = -1;
  render = () => template.call(this, this.props, this.state);

  constructor(props: HomeProps) {
    super(props);
    this.state = { session_id: undefined };
  }

  componentDidMount(): void {
    this.unsubscribeSessionResponse = this.homeService.onSessionResponse(
      (response) => {
        if (response.session_id) {
          this.setState({ session_id: response.session_id });
        }
      }
    );

    // Refresh Session every thirty seconds.
    this.homeService.feedSession({});
    this.clearSessionInterval = window.setInterval(() => {
      this.homeService.feedSession({ session_id: this.state.session_id });
    }, 30000);

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    window.clearInterval(this.clearSessionInterval);
    this.unsubscribeSessionResponse();

    this.homeService.feedSession({
      session_id: this.state.session_id,
      destroy: true,
    });
  };
}
