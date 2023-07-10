import React from "react";

import "./not_found.scss";
import {
  NotFoundController,
  NotFoundProps,
  NotFoundState,
} from "./not_found_interface";

export function template(
  this: NotFoundController,
  props: NotFoundProps,
  state: NotFoundState
) {
  return <div>Hi</div>;
}
