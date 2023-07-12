import React from "react";

import "./app.scss";
import { AppController, AppProps, AppState } from "./app_interface";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../navbar/navbar";
import { Admin } from "../../../admin/components/admin/admin";
import { Opportunity } from "../../../opportunity/components/opportunity/opportunity";
import { OpportunityFeed } from "../../../opportunity/components/opportunity_feed/opportunity_feed";
import { OpportunityView } from "../../../opportunity/components/opportunity_view/opportunity_view";
import { Landing } from "../../../landing/components/landing/landing";
import Container from "react-bootstrap/esm/Container";

export function template(
  this: AppController,
  props: AppProps,
  state: AppState
) {
  return (
    <BrowserRouter>
      <Container>
        <Navbar />
      </Container>
    </BrowserRouter>
  );
}
