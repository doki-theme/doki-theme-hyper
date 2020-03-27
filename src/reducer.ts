import { Action } from "redux";
import { TOGGLE_THEME_LIST } from "./middleware";

export interface ThemeState {
  showHelp?: boolean;
}

export const THEME_STATE = 'dokiThemeState';
const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case TOGGLE_THEME_LIST: 
      const previousState: ThemeState = state[THEME_STATE] || {};
      return state.set(THEME_STATE, {
        ...previousState,
        showHelp: !previousState.showHelp
      });
    default:
      return state;
  }
}

export default reducer;