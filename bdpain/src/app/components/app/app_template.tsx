import React from "react";

import "./app.scss";
import { AppController, AppProps, AppState } from "./app_interface";
import { Routes, Route } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Container from "react-bootstrap/Container";
import { NotFound } from "../not_found/not_found";
import { Landing } from "../../../landing/components/landing/landing";
import Auth from "../../../auth/components/auth/auth";
import { AuthType } from "../../../auth/components/auth/auth_interface";
import ProtectedRoute from "../protected_route/protected_route";
import { UserType } from "../../../contrib/services/user/lib";
import { Admin } from "../../../admin/components/admin/admin";
import Opportunity from "../../../opportunity/components/opportunity/opportunity";

export function template(
  this: AppController,
  props: AppProps,
  state: AppState
) {
  return (
    <main data-bs-theme={state.theme} className="app">
      <Navbar></Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/auth/login"
            element={
              <ProtectedRoute
                isAllowed={!this.isLoggedIn}
                redirectPath={`/in/${this.url}`}
              >
                <Auth type={AuthType.LOGIN} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/register"
            element={
              <ProtectedRoute
                isAllowed={!this.isLoggedIn}
                redirectPath={`/in/${this.url}`}
              >
                <Auth type={AuthType.REGISTER} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/forgot"
            element={
              <ProtectedRoute
                isAllowed={!this.isLoggedIn}
                redirectPath={`/in/${this.url}`}
              >
                <Auth type={AuthType.FORGOT} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/auth/forgot/:security"
            element={
              <ProtectedRoute
                isAllowed={!this.isLoggedIn}
                redirectPath={`/in/${this.url}`}
              >
                <Auth type={AuthType.FORGOT} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                isAllowed={this.isLoggedIn && this.userType === UserType.ADMIN}
                redirectPath={`/in/${this.url}`}
              >
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities"
            element={
              <ProtectedRoute isAllowed={this.isLoggedIn} redirectPath={`/`}>
                <Opportunity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/opportunities/:id"
            element={
              <ProtectedRoute isAllowed={this.isLoggedIn} redirectPath={`/`}>
                <Opportunity />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
      <footer className="footer bg-body-tertiary">
        <Container>
          <span className="text-muted">
            @copy; 2023 InBDPA. All rights reserved.
          </span>
        </Container>
      </footer>
    </main>
  );
}
