import {AnyAction} from "redux";
import {SET_STICKER_TYPE, SET_THEME, TOGGLE_STICKER} from "./settings";
import {DokiTheme, Sticker} from "./themeTools";
import {extractConfig, getCorrectSticker, getTheme} from "./config";

export interface ThemeState {
  activeTheme: DokiTheme;
  currentSticker: Sticker;
  showSticker: boolean;
}

export const THEME_STATE = 'dokiThemeState';

const reducer = (state: any, action: AnyAction) => {
  switch (action.type) {
    case SET_THEME: {
      const previousState: ThemeState = state[THEME_STATE] || {};
      return state.set(THEME_STATE, {
        ...previousState,
        activeTheme: action.payload
      });
    }
    case SET_STICKER_TYPE: {
      const previousState: ThemeState = state[THEME_STATE] || {};
      return state.set(THEME_STATE, {
        ...previousState,
        currentSticker: getCorrectSticker(
          previousState.activeTheme, action.payload
        )
      });
    }
    case TOGGLE_STICKER: {
      const previousState2: ThemeState = state[THEME_STATE] || {};
      return state.set(THEME_STATE, {
        ...previousState2,
        showSticker: !state[THEME_STATE].showSticker
      });
    }
    case 'INIT': {
      const {theme, sticker} = getTheme();
      return state.set(THEME_STATE, {
        activeTheme: theme,
        currentSticker: sticker,
        showSticker: extractConfig().showSticker,
      });
    }
    default: {
      return state;
    }
  }
};

export default reducer;
