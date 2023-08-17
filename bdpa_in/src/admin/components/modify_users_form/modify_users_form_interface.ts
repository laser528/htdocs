import { ChangeEvent, FormEvent } from "react";
import { User, UserType } from "../../../contrib/lib";

export interface ModifyUsersFormProps {
  user?: User;
  onComplete?: () => void;
}

export interface ModifyUsersFormState {
  username: string;
  password: string;
  email: string;
  showSpinner: boolean;
}

interface PasswordStrength {
  variant: string;
  class: string;
}

export interface ModifyUsersFormController {
  passwordStrength: PasswordStrength;
  promotions: UserType[];
  onUsernameChange: (event: ChangeEvent) => void;
  onPasswordChange: (event: ChangeEvent) => void;
  onEmailChange: (event: ChangeEvent) => void;
  onModifyFormSubmit: (event: FormEvent) => void;
}
