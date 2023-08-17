import React from "react";

import "./force_logout.scss";
import {
  ForceLogoutController,
  ForceLogoutProps,
  ForceLogoutState,
} from "./force_logout_interface";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { Spinner } from "../../../contrib/components/spinner/spinner";

export function template(
  this: ForceLogoutController,
  props: ForceLogoutProps,
  state: ForceLogoutState
) {
  return (
    <Container>
      <Card.Title className="mt-3">Force Logout</Card.Title>
      <Row className="col-8">
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Force Non-Admin User to Logout
        </Card.Title>
        <Form
          className="form-floating mb-3"
          id="forceLogoutForm"
          onSubmit={this.onForceLogoutSubmit}
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
              Force Logout {state.showSpinner ? <Spinner /> : null}
            </Button>
          </div>
        </Form>
      </Row>
    </Container>
  );
}
