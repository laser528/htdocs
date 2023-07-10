import React from "react";

import "./alert.scss";
import { AlertController, AlertProps, AlertState } from "./alert_interface";

export function template(
  this: AlertController,
  props: AlertProps,
  state: AlertState
) {
  return <div>Hi</div>;
}
