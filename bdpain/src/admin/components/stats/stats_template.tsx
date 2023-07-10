import React from "react";

import "./stats.scss";
import { StatsController, StatsProps, StatsState } from "./stats_interface";

export function template(
  this: StatsController,
  props: StatsProps,
  state: StatsState
) {
  return <div>Hi</div>;
}
