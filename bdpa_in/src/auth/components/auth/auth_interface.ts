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
  session_id?: string;
}

export interface AuthController {
  forgotPasswordId?: string;
}
