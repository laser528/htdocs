import { FormEvent } from "react";

export interface ImpersonationProps {
  onError?: (error: string) => {};
}

export interface ImpersonationState {
  showSpinner: boolean;
}

export interface ImpersonationController {
  onImpersonationSubmit: (event: FormEvent) => void;
}
