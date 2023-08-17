import { FormEvent } from "react";

export interface ImpersonationProps {}

export interface ImpersonationState {
  showSpinner: boolean;
}

export interface ImpersonationController {
  onImpersonationSubmit: (event: FormEvent) => void;
}
