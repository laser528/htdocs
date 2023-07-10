import { Component } from "react";
import { template } from "./captcha_template";
import {
  CaptchaProps,
  CaptchaController,
  CaptchaState,
} from "./captcha_interface";

export class Captcha
  extends Component<CaptchaProps, CaptchaState>
  implements CaptchaController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: CaptchaProps) {
    super(props);
  }
}
