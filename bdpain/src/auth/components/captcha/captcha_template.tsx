import React from "react";

import "./captcha.scss";
import {
  CaptchaController,
  CaptchaProps,
  CaptchaState,
} from "./captcha_interface";

export function template(
  this: CaptchaController,
  props: CaptchaProps,
  state: CaptchaState
) {
  return <div>Hi</div>;
}
