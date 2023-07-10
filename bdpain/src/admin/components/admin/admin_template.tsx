import React from "react";

import "./admin.scss";
import { AdminController, AdminProps, AdminState } from "./admin_interface";

export function template(
  this: AdminController,
  props: AdminProps,
  state: AdminState
) {
  return <div>Hi</div>;
}
