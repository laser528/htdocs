import React from "react";
import "./profile_top.scss"
import {
  ProfileTopController,
  ProfileTopProps,
  ProfileTopState,
} from "./profile_top_interface";
import Card from "react-bootstrap/Card";
import Image from 'react-bootstrap/Image';
import Row from "react-bootstrap/Row";

export function template(
  this: ProfileTopController,
  props: ProfileTopProps,
  state: ProfileTopState
) {
  return (
    <>
			<div className="rounded-top-3" id="Backdrop">
				
			</div>
			<div className="position-relative">
			<Image src="../../../favicon.ico" className="mt-3 border-0 position-absolute" id="ProfilePicture" roundedCircle thumbnail></Image>
			</div>
			<div className="pt-4 px-2" id="InfoSection">
				<Card.Body>
					<Card.Title className="fs-1 m-0 bolded">Username</Card.Title>
					<Card.Text className="fs-4 m-0">
						User Type
					</Card.Text>
					<span className="d-block">
						<Card.Text className="d-inline text-muted">
							City
						</Card.Text>
						<Card.Text className="d-inline me-1 text-muted">
							,
						</Card.Text>
						<Card.Text className="d-inline text-muted">
							State
						</Card.Text>
						<Card.Text className="d-inline me-1 text-muted">
							,
						</Card.Text>
						<Card.Text className="d-inline text-muted">
							Country
						</Card.Text>
						<Card.Text className="d-inline mx-1 text-muted">
							·
						</Card.Text>
						<Card.Text className="d-inline text-muted">
							Where
						</Card.Text>
					</span>
				</Card.Body>
			</div>
    </>
  );
}