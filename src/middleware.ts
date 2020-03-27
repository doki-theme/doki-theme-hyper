import { Action } from 'redux';

interface HasData<T> {
  data: T
}

type DataAction<T, U> = Action<T> & HasData<U>

const isDokiHelpCommandOutput = (commandOutput: string) =>
  commandOutput.indexOf('doki-themes')

export const TOGGLE_THEME_LIST = 'TOGGLE_THEME_LIST';

const middleware =
  (store: any) =>
    (next: any) =>
      (action: DataAction<string, string>) => {
        if (action.type === 'SESSION_ADD_DATA') {
          const { data: commandOutput } = action;
          if(isDokiHelpCommandOutput(commandOutput)){
            store.dispatch({
              type: TOGGLE_THEME_LIST
            })
          }
        }
      
        next(action)
      }

export default middleware;