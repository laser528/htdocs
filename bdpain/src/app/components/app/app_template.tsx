import React from "react";

import "./app.scss";
import { AppController, AppProps, AppState } from "./app_interface";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Container from "react-bootstrap/Container";
import { NotFound } from "../not_found/not_found";
import { Landing } from "../../../landing/components/landing/landing";
import { LoginForm } from "../../../auth/components/login_form/login_form";
import { Auth } from "../../../auth/components/auth/auth";

export function template(
  this: AppController,
  props: AppProps,
  state: AppState
) {
  return (
    <BrowserRouter>
      <main data-bs-theme={state.theme} className="app">
        <Navbar></Navbar>
        <Container>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </main>
    </BrowserRouter>
  );
}
