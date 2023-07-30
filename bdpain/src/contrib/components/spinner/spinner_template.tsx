import React from "react";
import Spinner from "react-bootstrap/Spinner";

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
  return (
    <Spinner animation="border" role="status">
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  );
}
