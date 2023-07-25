import React from "react";

import "./app.scss";
import { AppController, AppProps, AppState } from "./app_interface";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../navbar/navbar";
import Container from "react-bootstrap/Container";

export function template(
  this: AppController,
  props: AppProps,
  state: AppState
) {
  return (
    <BrowserRouter>
      <Container data-bs-theme={state.theme}>
        <Navbar />
      </Container>
    </BrowserRouter>
  );
}
