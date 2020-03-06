import { DEFAULT_CONFIGURATION } from "./config";
import {  StringDictonary } from "./themes";

export interface Stickers {
  default: string;
  secondary?: string;
  normal?: string;
}

export interface DokiTheme {
  colors: StringDictonary<string>;
  stickers: Stickers;
}

export const getThemeByName = (themeName: string | undefined): DokiTheme => {
  const definedThemeName = themeName || DEFAULT_CONFIGURATION.theme;
  return {
    stickers: {
      default: 'https://doki.assets.acari.io/stickers/vscode/killLaKill/ryuko/ryuko.png',
    },
    colors: {

    }  
  }
}