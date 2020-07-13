import { AnyAction } from "redux";
import { SET_STICKER_TYPE, SET_THEME, TOGGLE_STICKER, CYCLE_THEME } from "./settings";
import { DokiSticker, DokiTheme } from "./themeTools";
import { extractConfig, getCorrectSticker, getTheme, saveConfig } from "./config";
import DokiThemeDefinitions from "./DokiThemeDefinitions";

export interface ThemeState {
  activeTheme: DokiTheme;
  currentSticker: DokiSticker;
  showSticker: boolean;
}

export const THEME_STATE = "dokiThemeState";

const flagshipThemes = [
  "f770dcfc-f41e-4b49-aa17-66e9ffc208fd",
"420b0ed5-803c-4127-97e3-dae6aa1a5972",
"63fe4617-4cac-47a5-9b93-6794514c35ad",
"8e8773ee-4bbb-4812-b311-005f04f6bb20",
"bc12b380-1f2a-4a9d-89d8-388a07f1e15f",
"dce48196-ff46-470c-b5f9-d1e23f4a79d3",
"a7e0aa28-739a-4671-80ae-3980997e6b71",
"a14733d6-8e15-4e75-b6b8-509f323e5b3b",
"b0340303-0a5a-4a20-9b9c-fc8ce9880078",
"c5e92ad9-2fa0-491e-b92a-48ab92d13597",
"19b65ec8-133c-4655-a77b-13623d8e97d3",
"3a78b13e-dbf2-410f-bb20-12b57bff7735",
"e828aaae-aa8c-4084-8993-d64697146930",
"546e8fb8-6082-4ef5-a5e3-44790686f02f"
// @ts-ignore
].map(id => DokiThemeDefinitions[id])

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
    case CYCLE_THEME: {
      const previousState: ThemeState = state[THEME_STATE] || {};
      const currentIndex = flagshipThemes.findIndex(t => t.information.id === previousState.activeTheme.information.id);
      const nextTheme = flagshipThemes[(currentIndex + 1) % flagshipThemes.length];
    
      saveConfig({
        ...extractConfig(),
        themeId: nextTheme.information.id,
      });

      const themeState: ThemeState = {
        ...previousState,
        activeTheme: nextTheme,
        currentSticker: {
          type: previousState.currentSticker.type,
          sticker: getCorrectSticker(
            nextTheme,
            previousState.currentSticker.type
          ),
        },
      };
      return state.set(THEME_STATE, themeState);
    
    }
    case "INIT": {
      const { theme, sticker } = getTheme();
      const themeState: ThemeState = {
        activeTheme: theme,
        currentSticker: sticker,
        showSticker: extractConfig().showSticker,
      };
      return state.set(THEME_STATE, themeState);
    }
    default: {
      return state;
    }
  }
};

export default reducer;
