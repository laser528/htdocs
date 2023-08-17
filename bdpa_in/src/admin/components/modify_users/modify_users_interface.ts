import { MouseEvent } from "react";
import { User } from "../../../contrib/lib";

export interface ModifyUsersProps {
  onError?: (error: string) => void;
}

export interface ModifyUsersState {
  users: User[];
  usersSliced: User[];
  userSpotlighted?: User;
  hasMoreItems: boolean;
  showModal: boolean;
}

export interface ModifyUsersController {
  fetchUsersFeed: () => void;
  onButtonClick: (user?: User) => (event: MouseEvent) => void;
  onButtonClose: () => void;
}
