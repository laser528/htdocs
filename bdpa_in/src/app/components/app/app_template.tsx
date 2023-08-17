import React from "react";

import "./app.scss";
import { AppController, AppProps, AppState } from "./app_interface";
import { Routes, Route } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Container from "react-bootstrap/Container";
import { NotFound } from "../not_found/not_found";
import { Home } from "../../../home/components/home/home";
import Auth from "../../../auth/components/auth/auth";
import { AuthType } from "../../../auth/components/auth/auth_interface";
import ProtectedRoute from "../protected_route/protected_route";
import { UserType } from "../../../contrib/lib";
import { Admin } from "../../../admin/components/admin/admin";
import Opportunity from "../../../opportunity/components/opportunity/opportunity";
import Profile from "../../../profile/components/profile/profile";

export function template(
  this: AppController,
  props: AppProps,
  state: AppState
) {
  return (
    <main id="app" data-bs-theme={state.theme} className="app">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/auth/login"
          element={
            <ProtectedRoute
              isAllowed={!this.isLoggedIn}
              redirectPath={`/in/${this.url}`}
            >
              <Container className="content-container">
                <Auth type={AuthType.LOGIN} />
              </Container>
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
              <Container className="content-container">
                <Auth type={AuthType.REGISTER} />
              </Container>
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
              <Container className="content-container">
                <Auth type={AuthType.FORGOT} />
              </Container>
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
              <Container className="content-container">
                <Auth type={AuthType.FORGOT} />
              </Container>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute
              isAllowed={
                this.isLoggedIn && this.userType === UserType.ADMINISTRATOR
              }
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
              <Container className="content-container">
                <Opportunity />
              </Container>
            </ProtectedRoute>
          }
        />
        <Route
          path="/opportunities/:id"
          element={
            <ProtectedRoute isAllowed={this.isLoggedIn} redirectPath={`/`}>
              <Container className="content-container">
                <Opportunity />
              </Container>
            </ProtectedRoute>
          }
        />
        <Route
          path="/in/:id"
          element={
            <Container className="content-container">
              <Profile />
            </Container>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <footer className="footer bg-body-tertiary">
        <Container>
          <span className="text-muted">
            &copy;2023 InBDPA. All rights reserved.
          </span>
        </Container>
      </footer>
    </main>
  );
}
