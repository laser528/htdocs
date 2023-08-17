import React, { ComponentType } from "react";
import {
  NavigateFunction,
  Params,
  useLocation,
  useNavigate,
  useParams,
  Location,
} from "react-router-dom";

interface RoutingProps {
  navigate: NavigateFunction;
  readonly params: Params<string>;
  location: Location;
}

export type WithRouterProps<T> = T & RoutingProps;
type OmitRouter<T> = Omit<T, keyof RoutingProps>;

export function withRouting<T>(
  Component: ComponentType<OmitRouter<T> & RoutingProps>
) {
  return (props: OmitRouter<T>) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    return (
      <Component
        location={location}
        navigate={navigate}
        params={params}
        {...props}
      />
    );
  };
}
