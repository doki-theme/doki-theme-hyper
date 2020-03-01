import { SESSION_ADD, SESSION_USER_DATA, CONFIG_LOAD, INPUT_STORAGE_PATH, PLUGIN, UI_DATA_PATH } from "./actions";

const pluginUIInitialState = {
  opened: true,
  [UI_DATA_PATH]: {},
  config: {
    top: '35px',
    bottom: '1px',
    opened: true,
    hotkey: 'Ctrl+G',
    context: {
      node: {
        tool: 'npm',
      },
    },
  },
};

const emptyDataRecords: {
  history: string[],
  context: { [type: string]: string[] },
} = {
  history: [],
  context: {},
};

export function reduceSessions(state: any, action: any) {
  switch (action.type) {
    case SESSION_ADD:
      // create a place to store user's inputs in each tab
      if (state[INPUT_STORAGE_PATH]) {
        return state.setIn([INPUT_STORAGE_PATH, action.uid], '');
      }
      return state.set(INPUT_STORAGE_PATH, { [action.uid]: '' });

    case SESSION_USER_DATA: {
      const previousInput = state[INPUT_STORAGE_PATH][state.activeUid];
      const pressedKey = action.data;

      // hitting backspace
      if (pressedKey.charCodeAt(0) === 127) {
        return state.setIn([INPUT_STORAGE_PATH, state.activeUid], previousInput ? previousInput.slice(0, -1) : '');
      }
      // pressing Enter ↵
      if (pressedKey.charCodeAt(0) === 13) {
        return state.setIn([INPUT_STORAGE_PATH, state.activeUid], '');
      }
      return state.setIn(
        [INPUT_STORAGE_PATH, state.activeUid],
        (previousInput || '') + (pressedKey || '').toLowerCase(),
      );
    }
    default:
      return state;
  }
}

export const reduceUI = (state: any, action: any) => {
  switch (action.type) {
    case '@@INIT':
    case '@@redux/INIT':
      return state.set(PLUGIN, pluginUIInitialState);
    case SESSION_ADD: {
      // create a place to save all data to display, for each tab
      return state.setIn([PLUGIN, UI_DATA_PATH, action.uid], emptyDataRecords);
    }
    case CONFIG_LOAD: {
      const config = action.config?.[PLUGIN] || {};
      const mergedUIState = state[PLUGIN].config.merge(config);
      return state.setIn([PLUGIN, 'config'], mergedUIState);
    }
    default:
      return state;
  }
}