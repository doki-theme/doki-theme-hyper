import { AnyAction } from "redux";
import { SET_THEME } from "./settings";
import { DokiTheme } from "./themeTemp";

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
    default:
      return state;
  }
}

export default reducer;