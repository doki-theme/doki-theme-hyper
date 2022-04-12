import {
  DokiSticker,
  DokiTheme,
  getThemeByName,
  StickerType,
} from "./themeTools";
import { constructSyntax } from "./syntax";
import {constructCSS} from "./css";
import path, {resolve} from "path";
import fs from "fs";
import os from "os";
import { createParentDirectories } from "./FileTools";

const applicationDirectory =
  process.env.XDG_CONFIG_HOME !== undefined
    ? path.join(process.env.XDG_CONFIG_HOME, "hyper")
    : process.platform == "win32"
    ? path.join(process.env.APPDATA || "", "Hyper")
    : os.homedir();


export const configDirectory = path.resolve(
  applicationDirectory,
  ".doki-theme-hyper-config"
);
const configFile = path.resolve(configDirectory, ".hyper.doki.config.json");
const hypeConfigFile = path.resolve(applicationDirectory, ".hyper.js");

export interface BackgroundSettings {
  opacity?: number;
}

export interface Config {
  dokiSettings: {
    backgrounds: {
      dark?: BackgroundSettings;
      light?: BackgroundSettings;
    },
    systemMatch?: {
      enabled?: boolean;
      lightTheme?: string;
      darkTheme?: string;
    }
  }

  [key: string]: any
}


export interface DokiThemeConfig {
  themeId: string;
  showSticker: boolean;
  showWallpaper: boolean;
  stickerType: StickerType;
  useFonts: boolean;
}


export const DEFAULT_THEME_ID = "5ca2846d-31a9-40b3-8908-965dad3c127d"; // Rimiru
export const DEFAULT_CONFIGURATION: DokiThemeConfig = {
  themeId: DEFAULT_THEME_ID,
  showSticker: true,
  showWallpaper: true,
  stickerType: StickerType.DEFAULT,
  useFonts: false,
};

export const extractConfig = (): DokiThemeConfig => {
  if (!fs.existsSync(configFile)) {
    createParentDirectories(configFile);
    fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIGURATION), "utf8");
    return DEFAULT_CONFIGURATION;
  }
  return JSON.parse(fs.readFileSync(configFile, "utf8"));
};

const defaultConfig = {
  dokiSettings: {
    backgrounds: {}
  }
};

export const extractHyperConfig = (): Config => {
  if (!fs.existsSync(hypeConfigFile)) {
    return defaultConfig;
  }
  return require(hypeConfigFile)?.config || defaultConfig;
};

export const saveConfig = (dokiConfig: DokiThemeConfig) => {
  fs.writeFileSync(configFile, JSON.stringify(dokiConfig), "utf8");
};

export function getCorrectSticker(theme: DokiTheme, stickerType: StickerType) {
  const defaultSticker = theme.stickers.default;
  return stickerType === StickerType.SECONDARY
    ? theme.stickers.secondary || defaultSticker
    : defaultSticker;
}

export const getTheme = (): {
  theme: DokiTheme;
  sticker: DokiSticker;
} => {
  const hyperDokiConfig = extractConfig();
  const theme = getThemeByName(hyperDokiConfig.themeId);
  const stickerType = hyperDokiConfig.stickerType;
  const sticker = getCorrectSticker(theme, stickerType);
  return {
    theme,
    sticker: {
      sticker,
      type: stickerType,
    },
  };
};

const getExtraSettings = (): { [key: string]: string } => {
  return extractConfig().useFonts
    ? {
        fontFamily:
          '"Victor Mono", Menlo, "DejaVu Sans Mono", Consolas, "Lucida Console", monospace',
        fontWeight: "italic",
      }
    : {};
};

export const decorateConfig = (config: Config) => {
  const { theme: dokiTheme, sticker } = getTheme();
  const syntax = constructSyntax(dokiTheme);
  const css = constructCSS(dokiTheme, sticker, config);
  return Object.assign({}, config, syntax, {
    ...getExtraSettings(),
    termCSS: config.termCSS || "",
    css: `${config.css || ""}
    ${css}
    `,
  });
};
