import React from "react";
import {
  AdminController,
  AdminProps,
  AdminState,
  AdminView,
} from "./admin_interface";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./admin.scss";
import { Stats } from "../stats/stats";
import { Impersonation } from "../impersonation/impersonation";
import { ForceLogout } from "../force_logout/force_logout";
import { ModifyUsers } from "../modify_users/modify_users";

export function modify_users_template(
  controller: AdminController,
  props: AdminProps,
  state: AdminState
) {}

export function template(
  this: AdminController,
  props: AdminProps,
  state: AdminState
) {
  return (
    <Container id="admin_container" fluid>
      <Row>
        <Col xl={12}>
          <Col xl={2} className="admin_sidebar">
            <Card className="admin_sidebar border-0 rounded-0 mt-4">
              <Nav defaultActiveKey="/home" className="flex-column">
                <Nav.Link
                  href="#"
                  onClick={this.onInfoClick}
                  className="admin_sidebar_links"
                >
                  Sites Info
                </Nav.Link>
                <Nav.Link
                  href="#"
                  onClick={this.onImpersonationClick}
                  className="admin_sidebar_links"
                >
                  Start Impersonation
                </Nav.Link>
                <Nav.Link
                  href="#"
                  onClick={this.onForceLogoutClick}
                  className="admin_sidebar_links"
                >
                  Force Logout
                </Nav.Link>
                <Nav.Link
                  href="#"
                  onClick={this.onModifyUsersClick}
                  className="admin_sidebar_links"
                >
                  Modify Users
                </Nav.Link>
              </Nav>
            </Card>
          </Col>
          <Col xl={10} className="admin_content mt-2 ms-4">
            {state.view === AdminView.INFO && <Stats />}
            {state.view === AdminView.IMPERSONATION && <Impersonation />}
            {state.view === AdminView.LOGOUT && <ForceLogout />}
            {state.view === AdminView.USERS && <ModifyUsers />}
          </Col>
        </Col>
      </Row>
    </Container>
  );
}
