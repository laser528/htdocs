import React from "react";

import "./opportunity_feed.scss";
import {
  OpportunityFeedController,
  OpportunityFeedProps,
  OpportunityFeedState,
} from "./opportunity_feed_interface";

export function template(
  this: OpportunityFeedController,
  props: OpportunityFeedProps,
  state: OpportunityFeedState
) {
  return <div>Hi</div>;
}
