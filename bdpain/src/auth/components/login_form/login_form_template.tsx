import React from "react";

import "./login_form.scss";
import {
  LoginFormController,
  LoginFormProps,
  LoginFormState,
} from "./login_form_interface";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Spinner } from "../../../contrib/components/spinner/spinner";

export function template(
  this: LoginFormController,
  props: LoginFormProps,
  state: LoginFormState
) {
  return (
    <>
      <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
        Sign In
        {!!state.loginAttempts ? (
          <sub style={{ display: "block", color: "red" }}>
            Login Attempts Remaining: {3 - state.loginAttempts}
          </sub>
        ) : null}
      </Card.Title>
      <Form className="form-floating mb-3" onSubmit={this.handleSubmit}>
        <Form.Floating className="mb-3">
          <Form.Control
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            pattern="[a-zA-Z0-9_\-]*"
            title="Hey your username can only be alphanumeric with dashes and underscores."
            required
          />
          <Form.Label htmlFor="username">Username</Form.Label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            required
          />
          <Form.Label htmlFor="password">Password</Form.Label>
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Check
            type="checkbox"
            id="rememberMe"
            name="rememberMe"
            value="true"
            label="Remember Me?"
          />
        </Form.Floating>
        <div className="d-grid">
          <Button
            type="submit"
            variant="primary"
            className="btn-login text-uppercase fw-bold"
          >
            Sign In {state.showSpinner ? <Spinner /> : null}
          </Button>
        </div>
      </Form>
      <Card.Link href="/auth/forgot" className="d-block text-center">
        Forgot Password?{" "}
      </Card.Link>
    </>
  );
}
