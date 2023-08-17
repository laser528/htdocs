import React from "react";

import "./not_found.scss";
import {
  NotFoundController,
  NotFoundProps,
  NotFoundState,
} from "./not_found_interface";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";

export function template(
  this: NotFoundController,
  props: NotFoundProps,
  state: NotFoundState
) {
  return (
    <Row className="not-found">
      <Col md={12}>
        <div className="error-template">
          <h1>Oops!</h1>
          <h2>404 Not Found</h2>
          <div className="error-details">
            Sorry, an error has occured, Requested page not found!
          </div>
        </div>
      </Col>
    </Row>
  );
}
