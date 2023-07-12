import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import "./navbar.scss";
import { NavbarController, NavbarProps, NavbarState } from "./navbar_interface";

export function template(
  this: NavbarController,
  props: NavbarProps,
  state: NavbarState
) {
  return (
    <Navbar className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="#home">
          <img
            alt=""
            src="logo192.png"
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          BDPAin
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}
