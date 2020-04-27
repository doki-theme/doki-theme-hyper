import { AnyAction } from "redux";
import { SET_THEME, TOGGLE_STICKER } from "./settings";
import { DokiTheme } from "./themeTools";
import { getTheme, extractConfig } from "./config";

export interface ThemeState {
  activeTheme: DokiTheme;
  showSticker: boolean;
}

export const THEME_STATE = 'dokiThemeState';

const reducer = (state: any, action: AnyAction) => {
  switch (action.type) {
    case SET_THEME:
      const previousState: ThemeState = state[THEME_STATE] || {};
      return state.set(THEME_STATE, {
        ...previousState,
        activeTheme: action.payload
      });
    case TOGGLE_STICKER:
      const previousState2: ThemeState = state[THEME_STATE] || {};
      return state.set(THEME_STATE, {
        ...previousState2,
        showSticker: !state[THEME_STATE].showSticker
      });
    case 'INIT':
      return state.set(THEME_STATE, {
        activeTheme: getTheme(),
        showSticker: extractConfig().showSticker,
      });
    default:
      return state;
  }
};

export default reducer;
