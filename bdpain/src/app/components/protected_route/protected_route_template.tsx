import React from "react";

import "./protected_route.scss";
import {
  ProtectedRouteController,
  ProtectedRouteProps,
  ProtectedRouteState,
} from "./protected_route_interface";

export function template(
  this: ProtectedRouteController,
  props: ProtectedRouteProps,
  state: ProtectedRouteState
) {
  return <div>Hi</div>;
}
