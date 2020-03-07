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
  const definedThemeName = themeName || DEFAULT_CONFIGURATION.theme;
  // @ts-ignore
  const maybeDokiTheme = DokiThemeDefinitions[definedThemeName.toLowerCase()];
  return maybeDokiTheme || DokiThemeDefinitions.ryuko;
}