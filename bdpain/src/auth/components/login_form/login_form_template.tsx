import React from "react";

import "./login_form.scss";
import {
  LoginFormController,
  LoginFormProps,
  LoginFormState,
} from "./login_form_interface";

export function template(
  this: LoginFormController,
  props: LoginFormProps,
  state: LoginFormState
) {
  return <div>Hi</div>;
}
