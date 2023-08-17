import { FormEvent, ChangeEvent } from "react";

export interface ForgotPasswordProps {
  security?: string;
}

export interface ForgotPasswordState {
  password: string;
  disabled: boolean;
  showSpinner: boolean;
}

interface PasswordStrength {
  variant: string;
  class: string;
}

export interface ForgotPasswordController {
  passwordStrength: PasswordStrength;

  handlePasswordChange: (event: ChangeEvent) => void;
  handleForgotPasswordSubmit: (event: FormEvent) => void;
  handleChangePasswordSubmit: (event: FormEvent) => void;
}
