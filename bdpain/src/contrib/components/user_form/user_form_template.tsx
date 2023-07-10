import React from "react";

import "./user_form.scss";
import {
  UserFormController,
  UserFormProps,
  UserFormState,
} from "./user_form_interface";

export function template(
  this: UserFormController,
  props: UserFormProps,
  state: UserFormState
) {
  return <div>Hi</div>;
}
