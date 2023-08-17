import { FormEvent, ChangeEvent } from "react";

export interface UserFormProps {}

interface Captcha {
  one: number;
  two: number;
}

export interface UserFormState {
  password: string;
  captcha: Captcha;
  captchaAnswer: string;
  disabled: boolean;
  showSpinner: boolean;
}

interface PasswordStrength {
  variant: string;
  class: string;
}

export interface UserFormController {
  passwordStrength: PasswordStrength;

  handleCaptchaChange: (event: ChangeEvent) => void;
  handlePasswordChange: (event: ChangeEvent) => void;
  handleSubmit: (event: FormEvent) => void;
}
