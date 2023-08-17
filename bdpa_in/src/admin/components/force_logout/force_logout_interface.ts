import { FormEvent } from "react";

export interface ForceLogoutProps {}

export interface ForceLogoutState {
  showSpinner: boolean;
}

export interface ForceLogoutController {
  onForceLogoutSubmit: (event: FormEvent) => void;
}
