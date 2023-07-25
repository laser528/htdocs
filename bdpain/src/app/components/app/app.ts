import { Component } from "react";
import { template } from "./app_template";
import { AppProps, AppController, AppState, AppTheme } from "./app_interface";

export class App
  extends Component<AppProps, AppState>
  implements AppController
{
  render = () => template.call(this, this.props, this.state);

  constructor(props: AppProps) {
    super(props);

    const theme = (localStorage.getItem("theme") as AppTheme) ?? AppTheme.LIGHT;
    this.state = { theme };
  }

  readonly onThemeChange = (theme: AppTheme) => {
    if (theme == this.state.theme) return;

    localStorage.setItem("theme", theme);
    this.setState({ theme });
  };
}
