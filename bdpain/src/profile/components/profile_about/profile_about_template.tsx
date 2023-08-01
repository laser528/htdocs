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
    <>
			<div className="row">
				<Card.Body>
				<Card.Title className="fs-5 bolded">About</Card.Title>
				<Card.Text className="mb-1 text-muted">
				I grew up in ..., ...in the ... I attended and received a B.A. in...
				</Card.Text>
				</Card.Body>
			</div>
    </>
  );
}