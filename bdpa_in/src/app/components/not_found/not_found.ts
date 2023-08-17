import { Component } from "react";
import { template } from "./not_found_template";
import {
  NotFoundProps,
  NotFoundController,
  NotFoundState,
} from "./not_found_interface";

export class NotFound
  extends Component<NotFoundProps, NotFoundState>
  implements NotFoundController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: NotFoundProps) {
    super(props);
  }
}
