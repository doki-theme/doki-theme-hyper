import {attemptToUpdateSticker} from './StickerUpdateService';
import {app} from 'electron';
import {SET_THEME} from './settings';

let listener: (event: Event,
               channel: string,
               ...args: any[]) => void;

export default () => {
  const browserWindow = app.getLastFocusedWindow()
  if (browserWindow && !listener) {
    attemptToUpdateSticker();
    listener = (_, channel) => {
      if (channel[0] === SET_THEME) {
        attemptToUpdateSticker();
      }
    }
    browserWindow.webContents.on('ipc-message', listener)
  }

}
