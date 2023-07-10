import React from "react";

import "./opportunity_view.scss";
import {
  OpportunityViewController,
  OpportunityViewProps,
  OpportunityViewState,
} from "./opportunity_view_interface";

export function template(
  this: OpportunityViewController,
  props: OpportunityViewProps,
  state: OpportunityViewState
) {
  return <div>Hi</div>;
}
