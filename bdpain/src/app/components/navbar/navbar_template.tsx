import React from "react";

import "./navbar.scss";
import { NavbarController, NavbarProps, NavbarState } from "./navbar_interface";

export function template(
  this: NavbarController,
  props: NavbarProps,
  state: NavbarState
) {
  return <div>Hi</div>;
}
