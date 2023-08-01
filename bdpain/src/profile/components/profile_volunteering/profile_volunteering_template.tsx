import React from "react";
import {
  ProfileVolunteeringController,
  ProfileVolunteeringProps,
  ProfileVolunteeringState,
} from "./profile_volunteering_interface";
import Card from "react-bootstrap/Card";
import Image from 'react-bootstrap/Image';

export function template(
  this: ProfileVolunteeringController,
  props: ProfileVolunteeringProps,
  state: ProfileVolunteeringState
) {
  return (
    <>
			<div className="row">
				<Card.Title className="fs-5 bolded">Volunteering</Card.Title>
				<div className="col-1">
						<Image src="../../../favicon.ico" className="mt-3" style={{height: 40}}></Image>
				</div>
				<div className="col-11 p-0">
					<Card.Body>
						<Card.Subtitle className="bolded">Role</Card.Subtitle>
						<span className="d-block">
							<Card.Text className="d-inline">
								Location
							</Card.Text>
						</span>
						<span className="d-block">
							<Card.Text className="d-inline text-muted">
								Date Started
							</Card.Text>
							<Card.Text className="d-inline mx-1 text-muted">
								-
							</Card.Text>
							<Card.Text className="d-inline text-muted">
								Date Ended/ Present
							</Card.Text>
							<Card.Text className="d-inline mx-1 text-muted">
								·
							</Card.Text>
							<Card.Text className="d-inline me-1 text-muted">
								yrs
							</Card.Text>
							<Card.Text className="d-inline me-1 text-muted">
								mos
							</Card.Text>
						</span>
						<Card.Text className="d-inline me-1">
							What you did...
						</Card.Text>
					</Card.Body>
				</div>
			</div>
    </>
  );
}