import { AnyAction } from "redux";
import { SET_THEME } from "./settings";
import { DokiTheme } from "./themeTemp";
import { getTheme } from "./config";

export interface ThemeState {
  activeTheme: DokiTheme
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
    case 'INIT':
      return state.set(THEME_STATE, {
        activeTheme: getTheme()
      })
    default:
      return state;
  }
}

export default reducer;