import { Component } from "react";
import { template } from "./opportunity_form_template";
import {
  OpportunityFormProps,
  OpportunityFormController,
  OpportunityFormState,
} from "./opportunity_form_interface";

export class OpportunityForm
  extends Component<OpportunityFormProps, OpportunityFormState>
  implements OpportunityFormController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: OpportunityFormProps) {
    super(props);
  }
}
