import { attemptToUpdateSticker } from "./StickerUpdateService";
import { app } from "electron";

const init = (): void => {
  if (app) {
    attemptToUpdateSticker();
  }
};

export default init;
