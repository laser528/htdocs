import React from "react";

import "./impersonation.scss";
import {
  ImpersonationController,
  ImpersonationProps,
  ImpersonationState,
} from "./impersonation_interface";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Spinner } from "../../../contrib/components/spinner/spinner";

export function template(
  this: ImpersonationController,
  props: ImpersonationProps,
  state: ImpersonationState
) {
  return (
    <Container fluid="md">
      <Card.Title className="mt-3">Start Impersonation</Card.Title>
      <Row className="col-8">
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Select Non-Admin User
        </Card.Title>
        <Form
          className="form-floating mb-3"
          onSubmit={this.onImpersonationSubmit}
        >
          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              id="usernameOrId"
              name="usernameOrId"
              placeholder="Enter UserName or UserId"
              required
            />
            <Form.Label htmlFor="usernameOrId">Username or UserID</Form.Label>
          </Form.Floating>
          <div className="d-grid">
            <Button
              type="submit"
              variant="primary"
              className="btn-login text-uppercase fw-bold"
            >
              Impersonate {state.showSpinner ? <Spinner /> : null}
            </Button>
          </div>
        </Form>
      </Row>
    </Container>
  );
}
