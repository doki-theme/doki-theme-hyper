import { DEFAULT_CONFIGURATION } from "./config";
import DokiThemeDefinitions from './DokiThemeDefinitions';
import toPairs from "lodash/toPairs";

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

const defaultTheme = DokiThemeDefinitions["420b0ed5-803c-4127-97e3-dae6aa1a5972"];
export const getThemeByName = (themeName: string | undefined): DokiTheme => {
  const definedThemeId = themeName || DEFAULT_CONFIGURATION.themeId;
  // @ts-ignore
  const maybeDokiTheme = DokiThemeDefinitions[definedThemeId];
  return maybeDokiTheme || defaultTheme;
};

export const findNextTheme = (themeId: string): DokiTheme => {
  const themes = toPairs(DokiThemeDefinitions);
  const currentIndex = themes.findIndex(([id])=>themeId === id);
  if(currentIndex < 0) {
    return defaultTheme;
  }
  return themes[(currentIndex + 1) % themes.length][1];
}