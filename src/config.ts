import { DokiTheme, getThemeByName } from "./themeTemp";
import { constructSyntax } from "./syntax";
import { constructCSS } from "./css";
import path from 'path';
import fs from 'fs';

const configFile = path.resolve(__dirname, 'config.json');

export interface DokiThemeConfig {
  themeId: string;
  showSticker: boolean;
}

export const DEFAULT_CONFIGURATION: DokiThemeConfig = {
  themeId: '420b0ed5-803c-4127-97e3-dae6aa1a5972',
  showSticker: true,
}

export const extractConfig =
  (): DokiThemeConfig =>{
    if(!fs.existsSync(configFile)){
      fs.writeFileSync(configFile, JSON.stringify(DEFAULT_CONFIGURATION), 'utf8');
      return DEFAULT_CONFIGURATION
    }
    return JSON.parse(fs.readFileSync(configFile, 'utf8'))
  }

export const saveConfig = (dokiConfig: DokiThemeConfig) => {
  fs.writeFileSync(configFile, JSON.stringify(dokiConfig), 'utf8');
}

export const getTheme = (): DokiTheme => {
  const hyperDokiConfig = extractConfig();
  return getThemeByName(hyperDokiConfig.themeId);
}

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
}
