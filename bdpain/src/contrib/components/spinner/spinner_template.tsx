import React from "react";

import "./spinner.scss";
import {
  SpinnerController,
  SpinnerProps,
  SpinnerState,
} from "./spinner_interface";

export function template(
  this: SpinnerController,
  props: SpinnerProps,
  state: SpinnerState
) {
  return <div>Hi</div>;
}
