import React from "react";
import {
  ProfileDetailedSectionController,
  ProfileDetailedSectionProps,
  ProfileDetailedSectionState,
} from "./profile_detailed_section_interface";
import Card from "react-bootstrap/Card";

export function template(
  this: ProfileDetailedSectionController,
  props: ProfileDetailedSectionProps,
  state: ProfileDetailedSectionState
) {
  return (
    <Card className="card border-0 shadow rounded-3 px-4 py-2">
      <Card.Title className="fs-5 bolded">{props.sectionTitle}</Card.Title>
      {state.section?.map((item, index) => {
        return (
          <div key={`${props.sectionTitle}-${index}`}>
            <Card.Subtitle className="bolded">
              {this.titleFormat(item.title)}
            </Card.Subtitle>
            <span className="d-block">
              <Card.Text className="d-inline">Location:</Card.Text>
              <Card.Text className="d-inline mx-1">
                {this.locationFormat(item.location)}
              </Card.Text>
            </span>
            <span className="d-block">
              <Card.Text className="d-inline text-muted">
                {this.dateFormat(item.startedAt)}
              </Card.Text>
              <Card.Text className="d-inline mx-1 text-muted">/</Card.Text>
              <Card.Text className="d-inline text-muted">
                {this.dateFormat(item.endedAt)}
              </Card.Text>
            </span>
            <Card.Text className="d-inline me-1">
              {this.descriptionFormat(item.description)}
            </Card.Text>
          </div>
        );
      })}
    </Card>
  );
}
