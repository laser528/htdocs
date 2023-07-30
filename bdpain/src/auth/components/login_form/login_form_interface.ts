import { FormEvent } from "react";

export interface LoginFormProps {
  onError?: (error: string) => void;
}

export interface LoginFormState {
  showSpinner: boolean;
  loginAttempts: number;
}

export interface LoginFormController {
  handleSubmit: (event: FormEvent) => void;
}
