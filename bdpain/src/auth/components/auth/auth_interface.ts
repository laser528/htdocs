import { MouseEvent, KeyboardEvent } from "react";

export enum AuthType {
  LOGIN = "Login",
  REGISTER = "Register",
  FORGOT = "FORGOT",
}

export interface AuthProps {
  type?: AuthType;
}

export interface AuthState {
  type: AuthType;
  errorMessage?: string;
}

export interface AuthController {
  forgotPasswordId?: string;

  handleAlertClose: () => void;
  onError: (error: string) => void;
}
