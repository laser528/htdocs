import React from "react";
import "./home.scss";
import { HomeController, HomeProps, HomeState } from "./home_interface";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

export function template(
  this: HomeController,
  props: HomeProps,
  state: HomeState
) {
  return (
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
            rounded
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
            Looking At Birds
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Public Speaker
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Special Training
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Health Kindness
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            DIY Engineering
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Offline Marketing
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Talent Selection
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Clown Services
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Business Overseer
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
            Make Connections
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Get Experience
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Mentor Others
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Spread Awareness
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Grow With Each Other
          </Button>
          <Button
            type="submit"
            variant="outline-dark"
            className="btn-register"
            id="SectionButtons"
          >
            Manage Yourself
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
            "Connecting with others in this application had really helped me!
            Especially when I didn't have any beforehand..."
          </Card.Title>
          <Card.Text className="fw-light" id="BiggerSectionText">
            Connect with others outside your workplace, find subcontractors, or
            talk with independent services and more! Afterall, the workplace
            isn't just about work.
          </Card.Text>
        </div>
        <div className="col-6 position-relative" id="FirstSectionSecondCol">
          <Image
            src="../../../favicon.ico"
            className="position-absolute"
            id="ConnectionImage"
            rounded
          ></Image>
        </div>
      </div>

      <div className="row" id="WhiteFourthSection">
        <div className="col-5" id="FourthSectionCol">
          <div className="position-relative" id="">
            <Image
              src="../../../favicon.ico"
              className="position-absolute"
              id="FourthSectionImage"
              rounded
            ></Image>
          </div>
          <div>
            <Card.Title className="fw-light" id="FourthSectionTitle">
              Connect with others in this application
            </Card.Title>
            <Button
              type="submit"
              variant="outline-dark"
              className="btn-register"
              id="ThirdSectionButton"
            >
              Find other that may help you
            </Button>
          </div>
        </div>
        <div className="col-5" id="FourthSectionCol">
          <div className="position-relative" id="">
            <Image
              src="../../../favicon.ico"
              className="position-absolute"
              id="FourthSectionImage"
              rounded
            ></Image>
          </div>
          <div>
            <Card.Title className="fw-light" id="FourthSectionTitle">
              Learn new skills to succeed
            </Card.Title>
            <DropdownButton
              variant="outline-dark"
              id="FourthSectionDropDown"
              title="Choose a topic to learn about"
            >
              <Dropdown.Item href="#/action-1">Bike Riding</Dropdown.Item>
              <Dropdown.Item href="#/action-2">Finances</Dropdown.Item>
              <Dropdown.Item href="#/action-3">
                Something Else Other Than This
              </Dropdown.Item>
              <Dropdown.Item href="#/action-4">Stocks</Dropdown.Item>
              <Dropdown.Item href="#/action-5">Walking</Dropdown.Item>
              <Dropdown.Item href="#/action-6">
                Sleeping Full Hours
              </Dropdown.Item>
              <Dropdown.Item href="#/action-7">Food Choices</Dropdown.Item>
              <Dropdown.Item href="#/action-8">Meditaion</Dropdown.Item>
            </DropdownButton>
          </div>
        </div>
      </div>

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
            rounded
          ></Image>
        </div>
      </div>

      <div className="landing_image_near_footer">
        <Row className="col-12">
          <Col className="col-1"></Col>
          <div className="col-10">
            <Card.Title className="h2 fw-light">
              Join your friends, classmates, and coworkers on InBDPA!
            </Card.Title>
            <Button className="landing_get_started_button">Get Started!</Button>
          </div>
          <Col className="col-1"></Col>
        </Row>
      </div>
    </>
  );
}
