import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import ProgressBar from "react-bootstrap/ProgressBar";
import { Spinner } from "../../../contrib/components/spinner/spinner";

import "./user_form.scss";
import {
  UserFormController,
  UserFormProps,
  UserFormState,
} from "./user_form_interface";

export function template(
  this: UserFormController,
  props: UserFormProps,
  state: UserFormState
) {
  return (
    <>
      <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
        Sign Up
      </Card.Title>
      <Form onSubmit={this.handleSubmit} autoComplete="off">
        <Form.Floating className={"mb-3"}>
          <Form.Control
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            pattern="[a-zA-Z0-9_\-]*"
            title="Username can only contain Alphanumeric Characters. Dashes and Underscores are allowed."
            required
          />
          <Form.Label htmlFor="username">Username</Form.Label>
        </Form.Floating>
        <Form.Floating className={"mb-3"}>
          <Form.Control
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            value={state.password}
            onChange={this.handlePasswordChange}
            required
          />
          <Form.Label htmlFor="password">Password</Form.Label>
          {state.password && (
            <ProgressBar
              striped
              animated
              variant={this.passwordStrength.class}
              label={this.passwordStrength.variant}
              now={100}
              className={`mb-3`}
            />
          )}
        </Form.Floating>
        <Form.Floating className="mb-3">
          <Form.Control
            type="email"
            id="email"
            name="email"
            placeholder="E-mail Address"
            required
          />
          <Form.Label htmlFor="email">E-mail Address</Form.Label>
        </Form.Floating>
        <Form.Floating className={"mb-3"}>
          <Form.Control
            type="text"
            id="captcha"
            placeholder={`What is ${state.captcha.one} * ${state.captcha.two}`}
            value={state.captchaAnswer ?? ""}
            onChange={this.handleCaptchaChange}
            required
          />
          <Form.Label htmlFor="captcha">{`What is ${state.captcha.one} * ${state.captcha.two}`}</Form.Label>
        </Form.Floating>
        <div className="d-grid">
          <Button
            type="submit"
            variant="primary"
            className="btn-register text-uppercase fw-bold"
          >
            Sign Up {state.showSpinner ? <Spinner /> : null}
          </Button>
        </div>
      </Form>
    </>
  );
}
