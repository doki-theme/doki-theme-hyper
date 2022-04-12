import { AnyAction } from "redux";
import {SET_STICKER_TYPE, SET_THEME, SYSTEM_THEME_CHANGED, TOGGLE_STICKER, TOGGLE_WALLPAPER} from "./settings";
import {DokiSticker, DokiTheme, StringDictonary} from "./themeTools";
import {DEFAULT_THEME_ID, extractConfig, extractHyperConfig, getCorrectSticker, getTheme, saveConfig} from "./config";
import DokiThemeDefinitions from "./DokiThemeDefinitions";

export interface ThemeState {
  activeTheme: DokiTheme;
  currentSticker: DokiSticker;
  showSticker: boolean;
  showWallpaper: boolean;
}

export const THEME_STATE = "dokiThemeState";

const themeNameToDefinition: StringDictonary<DokiTheme> =
    Object.values(
        DokiThemeDefinitions,
    ).reduce((accum, def) => {
        accum[def.information.name] = def;
        return accum;
    }, {} as StringDictonary<any>);


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
      saveConfig({
        ...extractConfig(),
        themeId: action.payload.information.id,
      });
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
    case SYSTEM_THEME_CHANGED: {
      const hyperConfig = extractHyperConfig();
      if (hyperConfig.dokiSettings?.systemMatch?.enabled) {
        const previousState: ThemeState = state[THEME_STATE] || {};
        const isWindowDark = action.payload.isDark;
        const themeKey = isWindowDark ?
          hyperConfig.dokiSettings.systemMatch.darkTheme || 'Zero Two Dark' :
          hyperConfig.dokiSettings.systemMatch.lightTheme || 'Zero Two Light';
        const activeThemeDef = themeNameToDefinition[themeKey] || themeNameToDefinition[
          DokiThemeDefinitions[DEFAULT_THEME_ID].information.name
          ];
        const themeState: ThemeState = {
          ...previousState,
          activeTheme: activeThemeDef
        };
        saveConfig({
          ...extractConfig(),
          themeId: activeThemeDef.information.id,
        });
        return state.set(THEME_STATE, themeState);
      } else {
        return state;
      }
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
      const dokiThemeConfig = extractConfig();
      const themeState: ThemeState = {
        activeTheme: theme,
        currentSticker: sticker,
        showSticker: dokiThemeConfig.showSticker,
        showWallpaper: dokiThemeConfig.showWallpaper,
      };
      return state.set(THEME_STATE, themeState);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
