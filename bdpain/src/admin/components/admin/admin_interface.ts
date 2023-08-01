import { FormEvent, MouseEvent } from "react";

export interface AdminProps {}

export enum AdminView {
  INFO,
  IMPERSONATION,
  LOGOUT,
  USERS,
}

interface Info {
  users: number;
  sessions: number;
  opportunities: number;
  views: number;
}

export interface AdminState {
  view: AdminView;
  info?: Info;
  showSpinner: boolean;
}

export interface AdminController {
  onInfoClick: (event: MouseEvent) => void;
  onImpersonationClick: (event: MouseEvent) => void;
  onForceLogoutClick: (event: MouseEvent) => void;
  onModifyUsersClick: (event: MouseEvent) => void;

  onImpersonationSubmit: (event: FormEvent) => void;
  onForceLogoutSubmit: (event: FormEvent) => void;
}
