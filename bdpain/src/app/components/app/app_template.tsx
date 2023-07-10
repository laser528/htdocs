import React from "react";

import "./app.scss";
import { AppController, AppProps, AppState } from "./app_interface";

export function template(
  this: AppController,
  props: AppProps,
  state: AppState
) {
  return <div>Hi</div>;
}
