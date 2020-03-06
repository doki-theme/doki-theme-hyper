import { DEFAULT_CONFIGURATION } from "./config";
import { DokiThemeTemplateDefinition } from "./themes";

export interface DokiTheme extends DokiThemeTemplateDefinition {

}

export const getThemeByName = (themeName: string | undefined): DokiTheme => {
  const definedThemeName = themeName || DEFAULT_CONFIGURATION.theme;
  // @ts-ignore
  return {
  

  }
}