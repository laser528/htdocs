import { MouseEvent } from "react";

export interface AdminProps {
  view?: AdminView;
}

export enum AdminView {
  INFO,
  IMPERSONATION,
  LOGOUT,
  USERS,
}

export interface AdminState {
  view: AdminView;
  session_id?: string;
}

export interface AdminController {
  onInfoClick: (event: MouseEvent) => void;
  onImpersonationClick: (event: MouseEvent) => void;
  onForceLogoutClick: (event: MouseEvent) => void;
  onModifyUsersClick: (event: MouseEvent) => void;
}
