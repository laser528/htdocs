import {
  OpportunityCardController,
  OpportunityCardProps,
  OpportunityCardState,
} from "./opportunity_card_interface";
import Card from "react-bootstrap/Card";
import Image from "react-bootstrap/Image";
import BDPA from "../../../static/assets/BDPA.png";
import { LinkContainer } from "react-router-bootstrap";
import Nav from "react-bootstrap/Nav";

export function template(
  this: OpportunityCardController,
  props: OpportunityCardProps,
  state: OpportunityCardState
) {
  const { title, createdAt, updatedAt, views, opportunity_id, activeViewers } =
    props.opportunity;
  return (
    <div className={`row ${props.className ?? ""}`}>
      <div className="col-1">
        <Image src={BDPA} className="mt-4" style={{ height: 40 }}></Image>
      </div>
      <div className="col-10 position-relative p-0">
        <Card.Body>
          <Card.Title className="fs-3 text-primary">
            <LinkContainer to={`/opportunities/${opportunity_id}`}>
              <Nav.Link>{title}</Nav.Link>
            </LinkContainer>
          </Card.Title>
          <span className="d-block">
            <Card.Text className="d-inline me-1 text-muted">Created:</Card.Text>
            <Card.Text className="d-inline me-1 text-success">
              {new Date(Number(createdAt)).toLocaleString()}
            </Card.Text>
            <span className="d-inline position-absolute end-0 me-3">
              <Card.Text className="d-inline me-1 text-muted">
                Views: {views}
              </Card.Text>
              <Card.Text className="d-inline me-1 text-muted fs-5">·</Card.Text>
              <Card.Text className="d-inline text-muted">
                Active Viewers: {activeViewers ?? 0}
              </Card.Text>
            </span>
          </span>
        </Card.Body>
      </div>
      <div className="col-1"></div>
    </div>
  );
}
