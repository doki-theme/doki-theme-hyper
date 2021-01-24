import { AnyAction } from "redux";
import {SET_STICKER_TYPE, SET_THEME, TOGGLE_STICKER, TOGGLE_WALLPAPER} from "./settings";
import { DokiSticker, DokiTheme } from "./themeTools";
import { extractConfig, getCorrectSticker, getTheme } from "./config";

export interface ThemeState {
  activeTheme: DokiTheme;
  currentSticker: DokiSticker;
  showSticker: boolean;
  showWallpaper: boolean;
}

export const THEME_STATE = "dokiThemeState";

const reducer = (state: any, action: AnyAction) => {
  switch (action.type) {
    case SET_THEME: {
      const previousState: ThemeState = state[THEME_STATE] || {};
      const themeState: ThemeState = {
        ...previousState,
        activeTheme: action.payload,
        currentSticker: {
          type: previousState.currentSticker.type,
          sticker: getCorrectSticker(
            action.payload,
            previousState.currentSticker.type
          ),
        },
      };
      return state.set(THEME_STATE, themeState);
    }
    case SET_STICKER_TYPE: {
      const previousState: ThemeState = state[THEME_STATE] || {};
      const themeState: ThemeState = {
        ...previousState,
        currentSticker: {
          type: action.payload,
          sticker: getCorrectSticker(previousState.activeTheme, action.payload),
        },
      };
      return state.set(THEME_STATE, themeState);
    }
    case TOGGLE_STICKER: {
      const previousState2: ThemeState = state[THEME_STATE] || {};
      const themeState: ThemeState = {
        ...previousState2,
        showSticker: !state[THEME_STATE].showSticker,
      };
      return state.set(THEME_STATE, themeState);
    }
    case TOGGLE_WALLPAPER: {
      const previousState2: ThemeState = state[THEME_STATE] || {};
      const themeState: ThemeState = {
        ...previousState2,
        showWallpaper: !state[THEME_STATE].showWallpaper,
      };
      return state.set(THEME_STATE, themeState);
    }
    case "INIT": {
      const { theme, sticker } = getTheme();
      const themeState: ThemeState = {
        activeTheme: theme,
        currentSticker: sticker,
        showSticker: extractConfig().showSticker,
        showWallpaper: extractConfig().showWallpaper,
      };
      return state.set(THEME_STATE, themeState);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
