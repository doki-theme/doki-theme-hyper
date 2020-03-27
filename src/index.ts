import { extractConfig } from "./config";
import { constructCSS } from "./css";
import { constructSyntax } from "./syntax";
import { getThemeByName } from "./themeTemp";

export {default as middleware} from './middleware'

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

