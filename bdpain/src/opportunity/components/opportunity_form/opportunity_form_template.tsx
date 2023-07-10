import React from "react";

import "./opportunity_form.scss";
import {
  OpportunityFormController,
  OpportunityFormProps,
  OpportunityFormState,
} from "./opportunity_form_interface";

export function template(
  this: OpportunityFormController,
  props: OpportunityFormProps,
  state: OpportunityFormState
) {
  return <div>Hi</div>;
}
