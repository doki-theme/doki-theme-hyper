import { DEFAULT_CONFIGURATION } from "./config";
import DokiThemeDefinitions from './DokiThemeDefinitions';

export interface StringDictonary<T> {
  [key: string]: T;
}

export interface Stickers {
  default: string;
  secondary?: string;
  normal?: string;
}

export interface DokiTheme {
  colors: StringDictonary<string>;
  sticker: string;
}

export const getThemeByName = (themeName: string | undefined): DokiTheme => {
  const definedThemeId = themeName || DEFAULT_CONFIGURATION.themeId;
  // @ts-ignore
  const maybeDokiTheme = DokiThemeDefinitions[definedThemeId];
  return maybeDokiTheme || DokiThemeDefinitions["420b0ed5-803c-4127-97e3-dae6aa1a5972"];
};