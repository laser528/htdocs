import React from "react";

import "./landing.scss";
import {
  LandingController,
  LandingProps,
  LandingState,
} from "./landing_interface";

export function template(
  this: LandingController,
  props: LandingProps,
  state: LandingState
) {
  return <div>Hi</div>;
}
