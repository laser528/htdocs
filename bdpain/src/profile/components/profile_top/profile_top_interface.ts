import { User } from "../../../contrib/user/models/user";

export interface ProfileTopProps {
  user: User;
  isEditable: boolean;
}

export interface ProfileTopState {
  url: string;
}

export interface ProfileTopController {}
