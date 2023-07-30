import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import "./auth.scss";
import { AuthController, AuthProps, AuthState } from "./auth_interface";
import { LoginForm } from "../login_form/login_form";
import { UserForm } from "../user_form/user_form";

export function template(
  this: AuthController,
  props: AuthProps,
  state: AuthState
) {
  return (
    <Row className="d-flex align-items-center justify-content-center">
      <Col sm={9} md={7} lg={5} mx={"auto"}>
        {state.errorMessage && (
          <Alert variant="danger" onClose={this.handleAlertClose} dismissible>
            <Alert.Heading>Oh No! You Got An Error! 😭</Alert.Heading>
            <p>{state.errorMessage}</p>
          </Alert>
        )}
        <Card className="shadow rounded-3 my-5">
          <Card.Body className="p-4 p-sm-5">
            <UserForm onError={this.onError}></UserForm>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
