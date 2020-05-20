import { DEFAULT_CONFIGURATION } from "./config";
import DokiThemeDefinitions from './DokiThemeDefinitions';

export interface StringDictonary<T> {
  [key: string]: T;
}

export enum StickerType {
  DEFAULT= "DEFAULT", SECONDARY = "SECONDARY"
}

export interface Sticker {
  path: string;
  name: string;
}

export interface DokiTheme {
  colors: StringDictonary<string>;
  stickers: {
    default: Sticker;
    secondary?: Sticker;
  }
  wallpaper: string;
}

export const getThemeByName = (themeName: string | undefined): DokiTheme => {
  const definedThemeId = themeName || DEFAULT_CONFIGURATION.themeId;
  // @ts-ignore
  const maybeDokiTheme = DokiThemeDefinitions[definedThemeId];
  return maybeDokiTheme || DokiThemeDefinitions["420b0ed5-803c-4127-97e3-dae6aa1a5972"];
};
