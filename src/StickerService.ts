import path from 'path';
import fs from "fs";
import { resolveLocalStickerPath, isStickerNotCurrent, StickerUpdateStatus } from "./StickerUpdateService";
import { performGet } from "./RESTClient";
import { VSCODE_ASSETS_URL } from "./ENV";
import { DokiTheme } from './themeTemp';
import {BrowserWindow} from 'electron';

export enum InstallStatus {
  INSTALLED, NOT_INSTALLED, FAILURE
}

const main = require.main || { filename: 'yeet' };
export const workbenchDirectory = path.join(path.dirname(main.filename), 'vs', 'workbench');



const downloadSticker = async (stickerPath: string, localDestination: string) => {
  const parentDirectory = path.dirname(localDestination);
  if (!fs.existsSync(parentDirectory)) {
    fs.mkdirSync(parentDirectory, { recursive: true });
  }

  const stickerUrl = `${VSCODE_ASSETS_URL}${stickerPath}`;
  console.log(`Downloading image: ${stickerUrl}`);
  const stickerInputStream = await performGet(stickerUrl);
  fs.writeFileSync(localDestination, stickerInputStream.read());
};

export async function getLatestStickerAndBackground(
  dokiTheme: DokiTheme,
  stickerStatus: StickerUpdateStatus
) {
  const localStickerPath = resolveLocalStickerPath(
    dokiTheme.sticker
  );
  if (stickerStatus === StickerUpdateStatus.STALE || 
    !fs.existsSync(localStickerPath) ||
    await isStickerNotCurrent(dokiTheme.sticker, localStickerPath)) {
    await downloadSticker(dokiTheme.sticker, localStickerPath);
    send('yeet','aoeu')
  }
}

export async function installSticker(
  dokiTheme: DokiTheme,
  stickerStatus: StickerUpdateStatus = StickerUpdateStatus.NOT_CHECKED
): Promise<boolean> {
    try {
      await getLatestStickerAndBackground(dokiTheme, stickerStatus);
      return true;
    } catch (e) {
      console.error('Unable to install sticker!', e);
    }

  return false;
}
