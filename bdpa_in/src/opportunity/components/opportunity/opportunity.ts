import { Component } from "react";
import { template } from "./opportunity_template";
import { OpportunityCardProps } from "../opportunity_card/opportunity_card_interface";
import {
  OpportunityProps,
  OpportunityController,
  OpportunityState,
} from "./opportunity_interface";
import {
  WithRouterProps,
  withRouting,
} from "../../../contrib/components/route_component/route_component";

export class Opportunity
  extends Component<WithRouterProps<OpportunityProps>, OpportunityState>
  implements OpportunityController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: WithRouterProps<OpportunityProps>) {
    super(props);
    this.state = { errorMessage: "" };
  }

  get id() {
    return this.props.params.id ?? "";
  }
}

export default withRouting<OpportunityProps>(Opportunity);
