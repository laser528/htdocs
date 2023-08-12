import React from "react";
import {
  ProfileExperienceController,
  ProfileExperienceProps,
  ProfileExperienceState,
} from "./profile_experience_interface";
import Card from "react-bootstrap/Card";
import Image from 'react-bootstrap/Image';

export function template(
  this: ProfileExperienceController,
  props: ProfileExperienceProps,
  state: ProfileExperienceState
) {
  return (
    <>
			<div className="row">
				<Card.Title className="fs-5 bolded">Experience</Card.Title>
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
							<Card.Text className="d-inline mx-1">
								·
							</Card.Text>
							<Card.Text className="d-inline">
								Status
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
			</div>
    </>
  );
}