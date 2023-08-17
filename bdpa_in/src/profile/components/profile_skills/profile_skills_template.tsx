import React from "react";
import {
  ProfileSkillsController,
  ProfileSkillsProps,
  ProfileSkillsState,
} from "./profile_skills_interface";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";

export function template(
  this: ProfileSkillsController,
  props: ProfileSkillsProps,
  state: ProfileSkillsState
) {
  return (
    <Card className="card border-0 shadow rounded-3 px-4 py-2">
      <Card.Title className="fs-5 bolded">Skills</Card.Title>
      {state.skills?.map((item, index) => {
        return (
          <div key={`skills-${index}`}>
            <Card.Subtitle className="bolded">
              {this.skillsFormat(item)}
            </Card.Subtitle>
          </div>
        );
      })}
    </Card>
  );
}
