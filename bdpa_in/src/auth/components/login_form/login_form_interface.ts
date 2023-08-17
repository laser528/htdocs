import { FormEvent } from "react";

export interface LoginFormProps {}

export interface LoginFormState {
  showSpinner: boolean;
  loginAttempts: number;
}

export interface LoginFormController {
  handleSubmit: (event: FormEvent) => void;
}
