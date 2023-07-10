import React from "react";

import "./force_logout.scss";
import {
  ForceLogoutController,
  ForceLogoutProps,
  ForceLogoutState,
} from "./force_logout_interface";

export function template(
  this: ForceLogoutController,
  props: ForceLogoutProps,
  state: ForceLogoutState
) {
  return <div>Hi</div>;
}
