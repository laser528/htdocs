import React from "react";
import {
  AdminController,
  AdminProps,
  AdminState,
  AdminView,
} from "./admin_interface";
import Nav from "react-bootstrap/Nav";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./admin.scss";
import { Spinner } from "../../../contrib/components/spinner/spinner";

export function info_template(
  controller: AdminController,
  props: AdminProps,
  state: AdminState
) {
  return !state.info ? (
    <Spinner />
  ) : (
    <Container fluid>
      <Card.Title className="mt-3">Sites Info</Card.Title>
      <Row className="col-12">
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Users
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.users}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Opportunities
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.opportunities}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Views
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.views}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-3 mt-2">
          <Card>
            <Card.Body>
              <Card.Title className="sites_info_card_title">
                Number of Active Viewers
              </Card.Title>
              <Card.Text className="sites_info_card_text">
                {state.info.sessions}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export function impersonation_template(
  controller: AdminController,
  props: AdminProps,
  state: AdminState
) {
  return (
    <Container>
      <Card.Title className="mt-3">Start Impersonation</Card.Title>
      <Row className="col-12">
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Select Non-Admin User
        </Card.Title>
        <Form
          className="form-floating mb-3"
          onSubmit={controller.onImpersonationSubmit}
        >
          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              id="userId"
              name="userId"
              placeholder="Enter User ID"
              required
            />
            <Form.Label htmlFor="userId">User ID</Form.Label>
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

export function force_logout_template(
  controller: AdminController,
  props: AdminProps,
  state: AdminState
) {
  return (
    <Container>
      <Card.Title className="mt-3">Force Logout</Card.Title>
      <Row className="col-12">
        <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
          Force Non-Admin User to Logout
        </Card.Title>
        <Form
          className="form-floating mb-3"
          onSubmit={controller.onForceLogoutSubmit}
        >
          <Form.Floating className="mb-3">
            <Form.Control
              type="text"
              id="userId"
              name="userId"
              placeholder="Enter User ID"
              required
            />
            <Form.Label htmlFor="userId">User ID</Form.Label>
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
      <Row className="col-12">
        <Col className="admin_sidebar col-2">
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
        <Col className="col-10 admin_content mt-4">
          {state.view === AdminView.INFO && info_template(this, props, state)}
          {state.view === AdminView.IMPERSONATION &&
            impersonation_template(this, props, state)}
          {state.view === AdminView.LOGOUT &&
            force_logout_template(this, props, state)}
        </Col>
      </Row>
    </Container>
  );
}
