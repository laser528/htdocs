import React from "react";

import "./password_checker.scss";
import {
  PasswordCheckerController,
  PasswordCheckerProps,
  PasswordCheckerState,
} from "./password_checker_interface";

export function template(
  this: PasswordCheckerController,
  props: PasswordCheckerProps,
  state: PasswordCheckerState
) {
  return <div>Hi</div>;
}
