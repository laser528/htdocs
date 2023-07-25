export enum AppTheme {
  LIGHT = "light",
  DARK = "dark",
}

export interface AppProps {}

export interface AppState {
  theme: AppTheme;
}

export interface AppController {
  onThemeChange: (theme: AppTheme) => void;
}
