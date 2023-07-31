import React from "react";
import Nav from "react-bootstrap/Nav";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import "./admin.scss";
import { AdminController, AdminProps, AdminState } from "./admin_interface";

export function template(
  this: AdminController,
  props: AdminProps,
  state: AdminState
) {
  return (
    <Row className="vh-100">
      <Nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
        <div className="position-sticky pt-3">
          <Nav.Link>Site Stats</Nav.Link>
          <Nav.Link>Start Impersonation</Nav.Link>
          <Nav.Link>Force User Logout</Nav.Link>
          <Nav.Link>Modify Users</Nav.Link>
        </div>
      </Nav>
    </Row>
  );
}
