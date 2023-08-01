import React from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";

import "./landing.scss";
import {
  LandingController,
  LandingProps,
  LandingState,
} from "./landing_interface";

export function template(
  this: LandingController,
  props: LandingProps,
  state: LandingState
) {
  return (
    <div className="landing">
      <>
        <div className="row">
          <Col className="col-5">
            <Card className="card border-0 rounded-0" id="LoginCard">
              <Card.Body className="px-4 py-2">
                <Card.Title
                  as="h5"
                  className="mb-5 mt-5 fw-light"
                  id="LoginTitle"
                >
                  Your journey only starts from here...
                </Card.Title>
                <Form className="form-floating mb-3">
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
                      label="Remember Me"
                    />
                  </Form.Floating>
                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      className="btn-login fw-bold"
                    >
                      Sign In
                    </Button>
                  </div>
                </Form>
                <Card.Link href="" className="d-block text-center">
                  Forgot Password?{" "}
                </Card.Link>
                <Row className="my-2">
                  <div className="d-inline col-5">
                    <hr></hr>
                  </div>
                  <div className="d-inline col-2 text-center">or</div>
                  <div className="d-inline col-5">
                    <hr></hr>
                  </div>
                </Row>
                <div className="d-grid">
                  <Stack className="gap-3">
                    <Button
                      type="submit"
                      variant="outline-secondary"
                      className="btn-register my-1 mb-3 fw-bold"
                    >
                      New to InBDPA? Join now
                    </Button>
                  </Stack>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <div className="col-6 position-relative">
            <Image
              src="../../../favicon.ico"
              className="position-absolute"
              id="BeginningImage"
              roundedCircle
            ></Image>
          </div>
        </div>

        <div className="row" id="DarkSection">
          <div className="col-3" id="FirstSectionFirstCol">
            <Card.Title className="fw-light" id="SectionTitle">
              Explore different opportunities for your next adventure
            </Card.Title>
            <Card.Text className="fw-light fs-5" id="SectionText">
              You can explore job/ volunteering posts and apply!
            </Card.Text>
          </div>
          <div className="col-6" id="FirstSectionSecondCol">
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Marketing
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Public Administration
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Employee Training
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Health Care
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Engineering
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Online Marketing
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Talent Management
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              IT Services
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Business Administration
            </Button>
            <Button
              type="submit"
              variant="outline-primary"
              className="btn-register"
              id="SectionButtons"
            >
              Show all
            </Button>
          </div>
        </div>

        <div className="row" id="WhiteSection">
          <div className="col-3" id="FirstSectionFirstCol">
            <Card.Title className="fw-light" id="SectionTitle">
              Find the right internship for you
            </Card.Title>
            <Card.Text className="fw-light fs-5" id="SectionText">
              Sometimes, you wish to experience before commiting!
            </Card.Text>
          </div>
          <div className="col-6" id="FirstSectionSecondCol">
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Marketing
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Public Administration
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Employee Training
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Health Care
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Engineering
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Online Marketing
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Talent Management
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              IT Services
            </Button>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="SectionButtons"
            >
              Business Administration
            </Button>
            <Button
              type="submit"
              variant="outline-primary"
              className="btn-register"
              id="SectionButtons"
            >
              Show all
            </Button>
          </div>
        </div>

        <div className="row" id="FindSection">
          <div className="col-3" id="FirstSectionFirstCol">
            <Card.Title className="fw-bolded" id="ThirdSectionTitle">
              Find the right employees for your business
            </Card.Title>
          </div>
          <div className="col-6" id="FirstSectionSecondCol">
            <Button
              type="submit"
              variant="outline-danger"
              className="btn-register"
              id="ThirdSectionButton"
            >
              Post a job
            </Button>
          </div>
        </div>

        <div className="row" id="DarkConnectionSection">
          <div className="col-4" id="FirstSectionFirstCol">
            <Card.Title className="" id="ThirdSectionTitle">
              "Connect with others in this application had really helped me!
              Especially when I didn't have any beforehand..."
            </Card.Title>
            <Card.Text className="fw-light" id="BiggerSectionText">
              Connect with others outside your workplace, find subcontractors,
              or talk with independent services and more! Afterall, the
              workplace isn't just about work.
            </Card.Text>
          </div>
          <div className="col-6 position-relative" id="FirstSectionSecondCol">
            <Image
              src="../../../favicon.ico"
              className="position-absolute"
              id="ConnectionImage"
              roundedCircle
            ></Image>
          </div>
        </div>

        {/* Zada's circles and boxes here */}

        <div className="row" id="WhitePathSection">
          <div className="col-6" id="PathCol">
            <div>
              <Card.Title id="ThirdSectionTitle">
                Find your road in InBDPA
              </Card.Title>
              <Card.Text className="fw-light" id="BiggerSectionText">
                Taking small steps can lead to bigger things, so start here!
              </Card.Text>
              <Stack className="gap-3">
                <Button
                  type="submit"
                  className="btn-register rounded-0"
                  id="PathButton"
                >
                  Student
                </Button>
                <Button
                  type="submit"
                  className="btn-register rounded-0"
                  id="PathButton"
                >
                  Professional
                </Button>
                <Button
                  type="submit"
                  className="btn-register rounded-0"
                  id="PathButton"
                >
                  Coaching or Training
                </Button>
              </Stack>
            </div>
          </div>
          <div className="col-6 position-relative" id="FirstSectionSecondCol">
            <Image
              src="../../../favicon.ico"
              className="position-absolute"
              id="PathImage"
              roundedCircle
            ></Image>
          </div>
        </div>
      </>
    </div>
  );
}
