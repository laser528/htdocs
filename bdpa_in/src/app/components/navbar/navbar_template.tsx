import React from "react";
import BDPA from "../../../static/assets/BDPA.png";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Image from "react-bootstrap/Image";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import { Briefcase, Search, PersonBadge } from "react-bootstrap-icons";

import "./navbar.scss";
import { NavbarController, NavbarProps, NavbarState } from "./navbar_interface";
import { LinkContainer } from "react-router-bootstrap";
import { UserType } from "../../../contrib/lib";

export function template(
  this: NavbarController,
  props: NavbarProps,
  state: NavbarState
) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar">
      <Container fluid>
        <Col className="col-3"></Col>
        <LinkContainer to="/">
          <Nav.Link>
            <Image src={BDPA} className="me-2" style={{ height: 30 }}></Image>
            <Navbar.Brand className="me-3">BDPAIn</Navbar.Brand>
          </Nav.Link>
        </LinkContainer>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form
            className="d-flex w-100 me-2"
            onSubmit={(event) => {
              event.preventDefault();
              console.log("hit");
            }}
          >
            <InputGroup>
              <InputGroup.Text style={{ borderRight: 0 }}>
                <Search />
              </InputGroup.Text>
              <Form.Control
                style={{ borderLeft: 0 }}
                name="search"
                placeholder="Search"
              />
            </InputGroup>
          </Form>
          {this.userType !== UserType.GUEST ? (
            <>
              <LinkContainer to="/opportunities">
                <Nav.Link>
                  <div className="navLockup me-3">
                    <Briefcase className="icon mx-auto" />
                    <span className="text">Opportunities</span>
                  </div>
                </Nav.Link>
              </LinkContainer>
              <LinkContainer to={`/in/${this.url}`}>
                <Nav.Link>
                  <div className="navLockup me-3">
                    <Image
                      className="image"
                      src={`https://www.gravatar.com/avatar/${this.emailHash}?d=mp`}
                    />
                    <span className="text">Me</span>
                  </div>
                </Nav.Link>
              </LinkContainer>
              {this.userType === UserType.ADMINISTRATOR ? (
                <LinkContainer to={`/admin`}>
                  <Nav.Link>
                    <div className="navLockup me-3">
                      <PersonBadge className="icon mx-auto" />
                      <span className="text">Admin</span>
                    </div>
                  </Nav.Link>
                </LinkContainer>
              ) : null}
            </>
          ) : (
            <></>
          )}
          {this.userType !== UserType.GUEST ? (
            <>
              <div className="vr me-3" />
              {this.isImpersonating ? (
                <Button
                  className="btn-danger glow-button"
                  onClick={this.stopImpersonating}
                >
                  Stop Impersonating
                </Button>
              ) : (
                <Button onClick={this.logout} className="me-2">
                  Logout
                </Button>
              )}
            </>
          ) : (
            <>
              <LinkContainer className="me-2" to="/auth/login">
                <Button>Login</Button>
              </LinkContainer>
              <LinkContainer to="/auth/register">
                <Button className="btn-success">Register</Button>
              </LinkContainer>
            </>
          )}
        </Navbar.Collapse>
        <Col className="col-3"></Col>
      </Container>
    </Navbar>
  );
}
