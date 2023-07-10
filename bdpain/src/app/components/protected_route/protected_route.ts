import { Component } from "react";
import { template } from "./protected_route_template";
import {
  ProtectedRouteProps,
  ProtectedRouteController,
  ProtectedRouteState,
} from "./protected_route_interface";

export class ProtectedRoute
  extends Component<ProtectedRouteProps, ProtectedRouteState>
  implements ProtectedRouteController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProtectedRouteProps) {
    super(props);
  }
}
