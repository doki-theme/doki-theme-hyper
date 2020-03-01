import { debug } from "console"

export {reduceSessions, reduceUI} from './store/reducers';


const DOKI_THEME_COMMAND = 'doki-theme';
const isDokiThemeCommand = (
  command: string,
  onCommand: (theme: string) => void) => {
  const dokiCommandIndex = command.indexOf(DOKI_THEME_COMMAND);
  const isDokiCommand = dokiCommandIndex > -1;
  if (isDokiCommand) {
    const newLocal = command.substr(dokiCommandIndex + DOKI_THEME_COMMAND.length).trim();
    debug(`command is: "${newLocal}"`);
    onCommand(newLocal)
  }
}

export const middleware = (store: any) =>
  (next: any) => (action: any) => {
    if ('SESSION_ADD_DATA' === action.type &&
      action.data && action.data.charCodeAt(0) === 13) {
      debug(JSON.stringify(store, null, 2))
      const { data } = action;
      // isDokiThemeCommand(data,
      // dokiTheme => store.dispatch({
      // type: 'DOKI_THEME_SET',
      // data: dokiTheme,
      // }));
    }
    next(action)
  }



const decorateConfig = (config: any) => {
  return {
    config: {
    },
    syntax: {

    },
    termCSS: '',
    css: ''
  }
}