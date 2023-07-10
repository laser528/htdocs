import React from "react";

import "./views.scss";
import { ViewsController, ViewsProps, ViewsState } from "./views_interface";

export function template(
  this: ViewsController,
  props: ViewsProps,
  state: ViewsState
) {
  return <div>Hi</div>;
}
