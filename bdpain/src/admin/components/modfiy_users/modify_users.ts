import { Component, MouseEvent } from "react";
import { template } from "./modify_users_template";
import {
  ModifyUsersProps,
  ModifyUsersController,
  ModifyUsersState,
} from "./modify_users_interface";
import { UserService } from "../../../contrib/user/services/user_service/user_service";
import { User, IUser } from "../../../contrib/user/models/user";

export class ModifyUsers
  extends Component<ModifyUsersProps, ModifyUsersState>
  implements ModifyUsersController
{
  private readonly userService = UserService.getInstance();
  private unsubscribeFeed = () => {};
  render = () => template.call(this, this.props, this.state);

  constructor(props: ModifyUsersProps) {
    super(props);
    this.state = {
      users: [],
      hasMoreItems: false,
      showModal: false,
      userSpotlighted: undefined,
    };
  }

  componentDidMount(): void {
    this.unsubscribeFeed = this.userService.onUserSuccess((response) => {
      if (response.error) {
        alert(response.error);
        return;
      }

      if (!response.users.length) {
        this.setState({ hasMoreItems: false });
        return;
      }

      const additionalUsers = response.users.map(
        (user: IUser) => new User(user)
      );

      this.setState({
        users: [...this.state.users, ...additionalUsers],
        hasMoreItems: true,
      });
    });

    this.fetchUsersFeed();

    document.addEventListener("beforeunload", this.cleanup);
  }

  componentWillUnmount(): void {
    this.cleanup();
    document.removeEventListener("beforeunload", this.cleanup);
  }

  private readonly cleanup = () => {
    this.unsubscribeFeed();
  };

  readonly fetchUsersFeed = () => {
    let after = undefined;
    if (!!this.state.users?.length) {
      after = this.state.users?.[this.state.users?.length - 1]?.getUserID();
    }

    this.userService.feedRequest({ after });
  };

  readonly onButtonClick = (user?: User) => (event: MouseEvent) => {
    this.setState({ showModal: true, userSpotlighted: user });
  };

  readonly onButtonClose = () => {
    this.setState({ showModal: false, userSpotlighted: undefined });
  };
}
