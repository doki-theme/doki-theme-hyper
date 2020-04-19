import { performGet } from './RESTClient';
import { installSticker } from './StickerService';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { VSCODE_ASSETS_URL } from './ENV';
import { getTheme } from './config';
import { BrowserWindow, app } from 'electron';

const fetchRemoteChecksum = async (stickerPath: string) => {
  const checksumUrl = `${VSCODE_ASSETS_URL}${stickerPath}.checksum.txt`;
  console.log(`Fetching checksum: ${checksumUrl}`);
  const checkSumInputStream = await performGet(checksumUrl);
  return checkSumInputStream.setEncoding('utf8').read();
};

export const resolveLocalStickerPath = (
  stickerPath: string,
): string => {
  const safeStickerPath = stickerPath.replace('/', path.sep);
  return path.join(__dirname, 'stickers', safeStickerPath);
};

export function createChecksum(data: Buffer | string): string {
  return crypto.createHash('md5')
    .update(data)
    .digest('hex');
}

const calculateFileChecksum = (filePath: string): string => {
  const fileRead = fs.readFileSync(filePath);
  return createChecksum(fileRead);
};

const fetchLocalChecksum = async (localSticker: string) => {
  return fs.existsSync(localSticker) ?
    calculateFileChecksum(localSticker) : 'File not downloaded, bruv.';
};

export const isStickerNotCurrent = async (
  stickerPath: string,
  localStickerPath: string
): Promise<boolean> => {
  try {
    const remoteChecksum = await fetchRemoteChecksum(stickerPath);
    const localChecksum = await fetchLocalChecksum(localStickerPath);
    return remoteChecksum !== localChecksum;
  } catch (e) {
    console.error('Unable to check for updates', e);
    return false;
  }
};
export enum StickerUpdateStatus {
  CURRENT, STALE, NOT_CHECKED,
}

export const attemptToUpdateSticker = async (browserWindow?: BrowserWindow) => {
  const currentTheme = getTheme();
  const localStickerPath = resolveLocalStickerPath(currentTheme.sticker);
  if (await isStickerNotCurrent(currentTheme.sticker, localStickerPath)) {
    await installSticker(currentTheme, StickerUpdateStatus.STALE);
    const resolvedBrowserWindow = browserWindow || app.getLastFocusedWindow();
    if (resolvedBrowserWindow) {
      resolvedBrowserWindow.webContents.send('yeet', 'aoeu');
    }
  }
};
