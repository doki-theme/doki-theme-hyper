import { DokiTheme, StringDictonary } from "./themeTemp";
import startsWith from 'lodash/startsWith'
import toPairs from 'lodash/toPairs'

const DOKI_TO_HYPER_COLOR_MAPPINGS: any = {
  'red': 'terminal.ansiRed',
  'green': 'terminal.ansiGreen',
  "yellow": 'terminal.ansiYellow',
  "blue": 'terminal.ansiBlue',
  'magenta': 'terminal.ansiMagenta',
  'cyan': 'terminal.ansiCyan' 
}

const DEFAULT_TERMINAL_COLORS = {
  black: '#000000',
  red: '#C51E14',
  green: '#1DC121',
  yellow: '#C7C329',
  blue: '#0A2FC4',
  magenta: '#C839C5',
  cyan: '#20C5C6',
  white: '#C7C7C7',
  lightBlack: '#686868',
  lightRed: '#FD6F6B',
  lightGreen: '#67F86F',
  lightYellow: '#FFFA72',
  lightBlue: '#6A76FB',
  lightMagenta: '#FD7CFC',
  lightCyan: '#68FDFE',
  lightWhite: '#FFFFFF',
}

const buildColors = (dokiTheme: DokiTheme) => {
  return toPairs(DEFAULT_TERMINAL_COLORS)
  .map(([colorName, colorValue]) => {
    const cleanedName = startsWith(colorName, 'light') ?
    colorName.substr(5).toLowerCase() : colorName;
    const themeTerminalColorAttribute = DOKI_TO_HYPER_COLOR_MAPPINGS[cleanedName];
    const themeTerminalColor = themeTerminalColorAttribute ? 
    dokiTheme.colors[themeTerminalColorAttribute] || colorValue : colorValue
    return  [colorName, themeTerminalColor];
  }).reduce((accum: StringDictonary<string>, [colorName, themeTerminalColor] )=> {
    accum[colorName] = themeTerminalColor;
    return accum;
  }, {})
}

export const constructSyntax = (dokiTheme: DokiTheme) => {
  const colors = buildColors(dokiTheme);
  return {
    colors,
    cursorColor: dokiTheme.colors.accentColor,
    cursorAccentColor: dokiTheme.colors.caretForeground,
    foregroundColor: dokiTheme.colors.foregroundColor,
    backgroundColor: '#00000000',
    borderColor: dokiTheme.colors.borderColor,
    selectionColor: `${dokiTheme.colors.selectionBackground}55`,
    fontFamily: '"Victor Mono", Menlo, "DejaVu Sans Mono", Consolas, "Lucida Console", monospace',
  };
}
