import { Component } from "react";
import {
  ProfileTopController,
  ProfileTopProps,
  ProfileTopState,
} from "./profile_top_interface";
import { template } from "./profile_top_template";
import { Md5 } from "ts-md5";

export class ProfileTop
  extends Component<ProfileTopProps, ProfileTopState>
  implements ProfileTopController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: ProfileTopProps) {
    super(props);
    this.state = { url: props.user.url };
  }

  get userEmailHash() {
    return Md5.hashStr(this.props.user.email);
  }
}
