import React from "react";

import "./protected_route.scss";
import {
  ProtectedRouteController,
  ProtectedRouteProps,
  ProtectedRouteState,
} from "./protected_route_interface";
import { Navigate, Outlet } from "react-router-dom";
import { WithRouterProps } from "../../../contrib/components/route_component/route_component";

export function template(
  this: ProtectedRouteController,
  props: WithRouterProps<ProtectedRouteProps>,
  state: ProtectedRouteState
) {
  return props.isAllowed ? (
    props.children ?? <Outlet />
  ) : (
    <Navigate
      to={props.redirectPath}
      state={{ path: props.location.pathname }}
      replace
    />
  );
}
