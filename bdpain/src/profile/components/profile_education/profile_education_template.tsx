import React from "react";
import {
  ProfileEducationController,
  ProfileEducationProps,
  ProfileEducationState,
} from "./profile_education_interface";
import Card from "react-bootstrap/Card";
import Image from 'react-bootstrap/Image';

export function template(
  this: ProfileEducationController,
  props: ProfileEducationProps,
  state: ProfileEducationState
) {
  return (
    <>
			<div className="row">
				<Card.Title className="fs-5 bolded">Education</Card.Title>
				<div className="col-1">
					<Image src="../../../favicon.ico" className="mt-3" style={{height: 40}}></Image>
				</div>
				<div className="col-11 p-0">
					<Card.Body>
						<Card.Subtitle className="bolded">School Name</Card.Subtitle>
						<span className="d-block">
							<Card.Text className="d-inline text-muted">
								Date Started
							</Card.Text>
							<Card.Text className="d-inline mx-1 text-muted">
								-
							</Card.Text>
							<Card.Text className="d-inline text-muted">
								Date Graduation
							</Card.Text>
						</span>
					</Card.Body>
				</div>
			</div>
    </>
  );
}