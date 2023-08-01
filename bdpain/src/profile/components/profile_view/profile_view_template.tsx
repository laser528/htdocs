import React from "react";
import {
  ProfileViewController,
  ProfileViewProps,
  ProfileViewState,
} from "./profile_view_interface";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Stack from "react-bootstrap/Stack";
import { ProfileAbout } from "../profile_about/profile_about";
import { ProfileExperience } from "../profile_experience/profile_experience";
import { ProfileSkills } from "../profile_skills/profile_skills";
import { ProfileEducation } from "../profile_education/profile_education";
import { ProfileVolunteering } from "../profile_volunteering/profile_volunteering";
import { ProfileTop } from "../profile_top/profile_top";

export function template(
  this: ProfileViewController,
  props: ProfileViewProps,
  state: ProfileViewState
) {
  return (
    <>
      <Stack className="gap-2 my-4">
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card border-0 shadow rounded-3">
            <Card.Body className="p-0">
              <ProfileTop />
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card border-0 shadow rounded-3">
            <Card.Body className="px-4 py-2">
              <ProfileAbout />
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card border-0 shadow rounded-3">
            <Card.Body className="px-4 py-2">
              <ProfileExperience />
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card border-0 shadow rounded-3">
            <Card.Body className="px-4 py-2">
              <ProfileEducation />
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card border-0 shadow rounded-3">
            <Card.Body className="px-4 py-2">
              <ProfileVolunteering />
            </Card.Body>
          </Card>
        </Col>
        <Col className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <Card className="card border-0 shadow rounded-3">
            <Card.Body className="px-4 py-2">
              <ProfileSkills />
            </Card.Body>
          </Card>
        </Col>
      </Stack>
    </>
  );
}
