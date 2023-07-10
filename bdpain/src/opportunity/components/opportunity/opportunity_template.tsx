import React from "react";

import "./opportunity.scss";
import {
  OpportunityController,
  OpportunityProps,
  OpportunityState,
} from "./opportunity_interface";

export function template(
  this: OpportunityController,
  props: OpportunityProps,
  state: OpportunityState
) {
  return <div>Hi</div>;
}
