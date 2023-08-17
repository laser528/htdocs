import React from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import "./auth.scss";
import {
  AuthController,
  AuthProps,
  AuthState,
  AuthType,
} from "./auth_interface";
import { LoginForm } from "../login_form/login_form";
import { UserForm } from "../user_form/user_form";
import { ForgotPassword } from "../forgot_password/forgot_password";

export function template(
  this: AuthController,
  props: AuthProps,
  state: AuthState
) {
  return (
    <Row className="d-flex align-items-center justify-content-center">
      <Col sm={9} md={7} lg={5} mx={"auto"}>
        <Card className="shadow rounded-3 my-5">
          <Card.Body className="p-4 p-sm-5">
            {state.type === AuthType.LOGIN && <LoginForm />}
            {state.type === AuthType.REGISTER && <UserForm />}
            {state.type === AuthType.FORGOT && (
              <ForgotPassword security={this.forgotPasswordId} />
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
