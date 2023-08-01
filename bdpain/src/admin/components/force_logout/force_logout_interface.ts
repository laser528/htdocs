import { FormEvent } from "react";

export interface ForceLogoutProps {
  onError?: (error: string) => {};
}

export interface ForceLogoutState {
  showSpinner: boolean;
}

export interface ForceLogoutController {
  onForceLogoutSubmit: (event: FormEvent) => void;
}
