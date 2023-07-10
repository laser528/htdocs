import { Component } from "react";
import { template } from "./views_template";
import { ViewsProps, ViewsController, ViewsState } from "./views_interface";

export class Views
  extends Component<ViewsProps, ViewsState>
  implements ViewsController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ViewsProps) {
    super(props);
  }
}
