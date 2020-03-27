import { DokiTheme, getThemeByName } from "./themeTemp";
import { constructSyntax } from "./syntax";
import { constructCSS } from "./css";

export interface DokiThemeConfig {
  theme: string;
  showSticker: boolean;
}

export const DEFAULT_CONFIGURATION: DokiThemeConfig = {
  theme: 'Ibuki Dark',
  showSticker: true,
}

export const decorateConfig = (config: any) => {
  const hyperDokiConfig = extractConfig(config);
  const dokiTheme = getThemeByName(hyperDokiConfig.theme);

  const syntax = constructSyntax(dokiTheme);
  const css = constructCSS(dokiTheme, hyperDokiConfig);
  return Object.assign({}, config, syntax, {
    termCSS: config.termCSS || '',
    css: `${config.css || ''}
    ${css}
    `
  });
}

export const extractConfig =
  (parentConfig: any): DokiThemeConfig =>
    parentConfig.dokiTheme ||
    DEFAULT_CONFIGURATION
