import React from "react";
import {
  ProfileAboutController,
  ProfileAboutProps,
  ProfileAboutState,
} from "./profile_about_interface";
import Card from "react-bootstrap/Card";

export function template(
  this: ProfileAboutController,
  props: ProfileAboutProps,
  state: ProfileAboutState
) {
  return (
    <Card className="card border-0 shadow rounded-3 px-4 py-2">
      <Card.Title className="fs-5 bolded">About</Card.Title>
      <Card.Body>
        <Card.Text className="mb-1 text-muted">
          {this.aboutFormat(state.about)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
