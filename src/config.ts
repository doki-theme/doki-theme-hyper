import { DokiTheme, getThemeByName } from "./themeTools";
import { constructSyntax } from "./syntax";
import { constructCSS } from "./css";
import path from 'path';
import fs from 'fs';
import os from 'os';

const applicationDirectory =
  process.env.XDG_CONFIG_HOME !== undefined
    ? path.join(process.env.XDG_CONFIG_HOME, 'hyper')
    : process.platform == 'win32'
    ? path.join(process.env.APPDATA!, 'Hyper')
    : os.homedir();

const configFile = path.resolve(applicationDirectory, '.hyper.doki.config.json');

export interface DokiThemeConfig {
  themeId: string;
  showSticker: boolean;
}

export const DEFAULT_CONFIGURATION: DokiThemeConfig = {
  themeId: '420b0ed5-803c-4127-97e3-dae6aa1a5972',
  showSticker: true,
};

export const extractConfig =
  (): DokiThemeConfig =>{
    if(!fs.existsSync(configFile)){
      fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIGURATION), 'utf8');
      return DEFAULT_CONFIGURATION
    }
    return JSON.parse(fs.readFileSync(configFile, 'utf8'))
  };

export const saveConfig = (dokiConfig: DokiThemeConfig) => {
  fs.writeFileSync(configFile, JSON.stringify(dokiConfig), 'utf8');
};

export const getTheme = (): DokiTheme => {
  const hyperDokiConfig = extractConfig();
  return getThemeByName(hyperDokiConfig.themeId);
};

export const decorateConfig = (config: any) => {
  const dokiTheme = getTheme();
  const syntax = constructSyntax(dokiTheme);
  const css = constructCSS(dokiTheme);
  return Object.assign({}, config, syntax, {
    termCSS: config.termCSS || '',
    css: `${config.css || ''}
    ${css}
    `
  });
};
