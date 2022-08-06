import {
  DokiSticker,
  DokiTheme,
  getThemeByName,
  StickerType,
} from "./themeTools";
import { constructSyntax } from "./syntax";
import {constructCSS} from "./css";
import path from "path";
import fs, {readFileSync} from "fs";
import os from "os";
import { createParentDirectories } from "./FileTools";
import vm from "vm";

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
const hyperConfigFile = path.resolve(applicationDirectory, ".hyper.js");

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


export const DEFAULT_THEME_ID = "5ca2846d-31a9-40b3-8908-965dad3c127d"; // Rimuru
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

const _extract = (script?: vm.Script): Record<string, any> => {
  const module: Record<string, any> = {};
  script?.runInNewContext({module});
  if (!module.exports) {
    throw new Error('Error reading configuration: `module.exports` not set');
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return module.exports;
};

const _syntaxValidation = (cfg: string) => {
  try {
    return new vm.Script(cfg, {filename: '.hyper.js', displayErrors: true});
  } catch (_err) {
    const err = _err as {name: string};
    console.error(`Error loading config: ${err.name}`, `${err}`, {error: err});
  }
};

const _extractDefault = (cfg: string) => {
  return _extract(_syntaxValidation(cfg));
};

// there isn't a good way to access the application
// configuration (.hyper.js), so will just be
// reading the contents of the file and loading the
// js, and passing the doki confi
export const extractHyperConfig = (): Config => {
  if (!fs.existsSync(hyperConfigFile)) {
    return defaultConfig;
  }
  const extractDefault = _extractDefault(
    readFileSync(hyperConfigFile, 'utf8')
  );
  return extractDefault?.config || defaultConfig;
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
