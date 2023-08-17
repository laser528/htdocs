import { Component } from "react";
import { template } from "./protected_route_template";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";
import {
  ProtectedRouteProps,
  ProtectedRouteController,
  ProtectedRouteState,
} from "./protected_route_interface";

export class ProtectedRoute
  extends Component<WithRouterProps<ProtectedRouteProps>, ProtectedRouteState>
  implements ProtectedRouteController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<ProtectedRouteProps>) {
    super(props);
  }
}

export default withRouting<ProtectedRouteProps>(ProtectedRoute);
