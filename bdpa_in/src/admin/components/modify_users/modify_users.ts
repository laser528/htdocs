import { Component, MouseEvent } from "react";
import { template } from "./modify_users_template";
import {
  ModifyUsersProps,
  ModifyUsersController,
  ModifyUsersState,
} from "./modify_users_interface";
import { AdminService } from "../../services/admin_service";
import { User } from "../../../contrib/lib";

export class ModifyUsers
  extends Component<ModifyUsersProps, ModifyUsersState>
  implements ModifyUsersController
{
  private readonly adminService = AdminService.getInstance();
  private unsubscribePromoteResponse = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ModifyUsersProps) {
    super(props);
    this.state = {
      users: [],
      usersSliced: [],
      hasMoreItems: true,
      showModal: false,
      userSpotlighted: undefined,
    };
  }

  componentDidMount(): void {
    this.unsubscribePromoteResponse = this.adminService.onPromoteResponse(
      (response) => {
        if (this.state.userSpotlighted) return;
        if (response.error) {
          alert(response.error);
          return;
        }

        if (!response.users.length) return;

        this.setState({
          users: [...response.users],
          usersSliced: response.users.slice(0, 20),
        });
      }
    );

    this.adminService.feedPromote();

    window.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    window.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribePromoteResponse();
  };

  readonly fetchUsersFeed = () => {
    const length = this.state.usersSliced.length;
    const newLength = length + 20;
    this.setState({
      usersSliced: [
        ...this.state.usersSliced,
        ...this.state.users.slice(length, newLength),
      ],
      hasMoreItems: newLength <= this.state.users.length,
    });
  };

  readonly onButtonClick = (user?: User) => (event: MouseEvent) => {
    this.setState({ showModal: true, userSpotlighted: user });
  };

  readonly onButtonClose = () => {
    this.setState({
      showModal: false,
      userSpotlighted: undefined,
      users: [],
      usersSliced: [],
    });
    this.adminService.feedPromote();
  };
}
