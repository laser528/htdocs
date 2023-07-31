import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import { Spinner } from "../../../contrib/components/spinner/spinner";

import "./opportunity_feed.scss";
import {
  OpportunityFeedController,
  OpportunityFeedProps,
  OpportunityFeedState,
} from "./opportunity_feed_interface";
import { OpportunityCard } from "../opportunity_card/opportunity_card";

export function template(
  this: OpportunityFeedController,
  props: OpportunityFeedProps,
  state: OpportunityFeedState
) {
  return (
    <Card className="card border-0">
      <Card.Title as="h5" className="text-center mb-5 fw-light fs-5">
        Opportunities!
        <sub style={{ display: "block" }}>
          Available Jobs and Volunteering Roles!
        </sub>
      </Card.Title>
      <Card.Body className="px-4 py-2">
        <InfiniteScroll
          dataLength={state.opportunities.length}
          next={this.fetchFeed}
          hasMore={this.hasMoreItems}
          loader={<Spinner />}
          style={{ overflow: "hidden" }}
        >
          {state.opportunities.map((item, index) => (
            <OpportunityCard
              className="border-bottom mb-4"
              opportunity={item}
              key={`opportunity-${index}`}
            />
          ))}
        </InfiniteScroll>
      </Card.Body>
    </Card>
  );
}
