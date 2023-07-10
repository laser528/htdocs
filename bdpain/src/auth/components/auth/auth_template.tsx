import React from "react";

import "./auth.scss";
import { AuthController, AuthProps, AuthState } from "./auth_interface";

export function template(
  this: AuthController,
  props: AuthProps,
  state: AuthState
) {
  return <div>Hi</div>;
}
