import React from "react";
import "./profile_top.scss";
import {
  ProfileTopController,
  ProfileTopProps,
  ProfileTopState,
} from "./profile_top_interface";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

export function template(
  this: ProfileTopController,
  props: ProfileTopProps,
  state: ProfileTopState
) {
  return (
    <>
      <div className="rounded-top-3" id="Backdrop" />
      <div className="position-relative">
        <Image
          src={`https://www.gravatar.com/avatar/${this.userEmailHash}?d=mp`}
          className="mt-3 border-0 position-absolute"
          id="ProfilePicture"
          roundedCircle
          thumbnail
        ></Image>
      </div>
      <div
        className="pt-5 px-2 rounded-bottom-3"
        id="InfoSection"
        style={{ background: "white" }}
      >
        <Card.Body>
          <Card.Title className="fs-1 m-0 bolded">
            {props.user.username}
          </Card.Title>
          <Card.Text className="fs-4 m-0">{props.user.type}</Card.Text>
          <Card.Text className="fs-5 m-0">
            Url: {`/in/${props.user.url}`}
          </Card.Text>
          <br></br>
        </Card.Body>
      </div>
    </>
  );
}
