import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Spinner } from "../../../contrib/components/spinner/spinner";

import "./forgot_password.scss";
import {
  ForgotPasswordController,
  ForgotPasswordProps,
  ForgotPasswordState,
} from "./forgot_password_interface";

export function changePassword(
  controller: ForgotPasswordController,
  props: ForgotPasswordProps,
  state: ForgotPasswordState
) {
  return (
    <>
      <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
        Change Password
      </Card.Title>
      <Form onSubmit={controller.handleChangePasswordSubmit}>
        <Form.Floating className={"mb-3"}>
          <Form.Control
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={state.password}
            onChange={controller.handlePasswordChange}
            required
          />
          <Form.Label htmlFor="password">Password</Form.Label>
          {state.password && (
            <ProgressBar
              striped
              animated
              variant={controller.passwordStrength.class}
              label={controller.passwordStrength.variant}
              now={100}
              className={`mb-3`}
            />
          )}
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            type="password"
            name="confirmation"
            id="confirmation"
            placeholder="Confirm Password"
            required
          />
          <Form.Label htmlFor="confirmation">Confirm Password</Form.Label>
        </Form.Floating>
        <div className="d-grid">
          <Button
            type="submit"
            variant="primary"
            className="btn-register text-uppercase fw-bold"
          >
            Change Password {state.showSpinner ? <Spinner /> : null}
          </Button>
        </div>
      </Form>
    </>
  );
}

export function forgotPassword(
  controller: ForgotPasswordController,
  props: ForgotPasswordProps,
  state: ForgotPasswordState
) {
  return (
    <>
      <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
        Forgot Password
      </Card.Title>
      <Form onSubmit={controller.handleForgotPasswordSubmit}>
        <Form.Floating className={"mb-3"}>
          <Form.Control
            type="email"
            name="email"
            id="email"
            placeholder="E-mail Address"
            required
          />
          <Form.Label htmlFor="email">E-mail Address</Form.Label>
        </Form.Floating>
        <div className="d-grid">
          <Button
            type="submit"
            variant="primary"
            className="btn-register text-uppercase fw-bold"
          >
            Submit {state.showSpinner ? <Spinner /> : null}
          </Button>
        </div>
      </Form>
    </>
  );
}

export function template(
  this: ForgotPasswordController,
  props: ForgotPasswordProps,
  state: ForgotPasswordState
) {
  return props.security
    ? changePassword(this, props, state)
    : forgotPassword(this, props, state);
}
