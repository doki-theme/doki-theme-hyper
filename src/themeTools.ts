import { DEFAULT_CONFIGURATION } from "./config";
import DokiThemeDefinitions from "./DokiThemeDefinitions";

export interface StringDictonary<T> {
  [key: string]: T;
}

export enum StickerType {
  DEFAULT = "DEFAULT",
  SECONDARY = "SECONDARY",
}

export interface Wallpaper {
  anchor?: string;
}

export interface Sticker {
  path: string;
  name: string;
  background: Wallpaper
}

export interface DokiSticker {
  type: StickerType;
  sticker: Sticker;
}

export interface ThemeInformation {
  id: string;
  name: string;
  displayName: string;
  dark: boolean;
  author: string;
  group: string;
}

export interface DokiTheme {
  colors: StringDictonary<string>;
  stickers: {
    default: Sticker;
    secondary?: Sticker;
  };
  information: ThemeInformation;
}

export const getThemeByName = (themeName: string | undefined): DokiTheme => {
  const definedThemeId = themeName || DEFAULT_CONFIGURATION.themeId;
  // @ts-ignore
  const maybeDokiTheme = DokiThemeDefinitions[definedThemeId];
  return (
    maybeDokiTheme ||
    DokiThemeDefinitions["420b0ed5-803c-4127-97e3-dae6aa1a5972"]
  );
};
