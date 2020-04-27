import {attemptToUpdateSticker} from './StickerUpdateService';
import {app} from 'electron';

const init = () => {
  if (app) {
    attemptToUpdateSticker();
  }
}

export default init;
