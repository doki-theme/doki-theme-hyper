import { Action } from "redux";
import { TOGGLE_THEME_LIST } from "./middleware";

export enum ThemeState {
  Help = 'Help'
}

const reducer = (state: any, action: Action) => {
  switch (action.type) {
    case TOGGLE_THEME_LIST: 
      return state.set(ThemeState.Help, !state[ThemeState.Help]);
    default:
      return state;
  }
}

export default reducer;