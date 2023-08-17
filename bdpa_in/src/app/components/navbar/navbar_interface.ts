import { Location } from "react-router-dom";
import { UserType } from "../../../contrib/lib";
import { MouseEvent } from "react";

export interface NavbarProps {}

export interface NavbarState {
  location: Location;
}

export interface NavbarController {
  emailHash: string;
  isImpersonating: boolean;
  url: string;
  userType: UserType;
  logout: (event: MouseEvent) => void;
  stopImpersonating: (event: MouseEvent) => void;
}
