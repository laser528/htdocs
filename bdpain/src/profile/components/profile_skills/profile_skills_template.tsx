import React from "react";
import {
  ProfileSkillsController,
  ProfileSkillsProps,
  ProfileSkillsState,
} from "./profile_skills_interface";
import Card from "react-bootstrap/Card";
import Image from 'react-bootstrap/Image';

export function template(
  this: ProfileSkillsController,
  props: ProfileSkillsProps,
  state: ProfileSkillsState
) {
  return (
    <>
      <div className="py-2 row">
        <Card.Title className="pb-2 fs-5 bolded">Skills</Card.Title>
        <Card.Subtitle className="bolded">Skill Name</Card.Subtitle>
        <div className="p-0">
          <Card.Body>
            <span className="d-inline">
              <Image src="../../../favicon.ico" className="me-1" style={{height: 20}}></Image>
              <Card.Text className="d-inline">
                Executive Worker
              </Card.Text>
              <Card.Text className="d-inline mx-1">
                at
              </Card.Text>
              <Card.Text className="d-inline">
                Location
              </Card.Text>
            </span>
          </Card.Body>
        </div>
      </div>
    </>
  );
}