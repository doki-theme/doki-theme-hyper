import { DEFAULT_CONFIGURATION } from "./config";

export interface DokiTheme {

}

export const getThemeByName = (themeName: string | undefined): DokiTheme => {
  const definedThemeName = themeName || DEFAULT_CONFIGURATION.theme;
  return {

  }
}