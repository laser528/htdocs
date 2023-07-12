import { ReactNode } from "react";

export interface ProtectedRouteProps {
  redirectPath: string;
  isAllowed: boolean;
  children?: ReactNode;
}

export interface ProtectedRouteState {}

export interface ProtectedRouteController {}
