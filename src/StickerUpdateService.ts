import {performGet} from './RESTClient';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import {VSCODE_ASSETS_URL} from './ENV';
import {getTheme} from './config';
import {app} from 'electron';
import {STICKER_UPDATED} from './settings';
import {DokiTheme} from "./themeTools";

export interface DokiStickers {
  stickerDataURL: string;
  backgroundImageURL: string;
}

export const attemptToUpdateSticker = async (): Promise<DokiStickers> => {
  const currentTheme = getTheme();
  const remoteStickerUrl = `${VSCODE_ASSETS_URL}${stickerPathToUrl(
    currentTheme
  )}`;
  // const remoteWallpaperUrl = `${BACKGROUND_ASSETS_URL}${wallpaperPathToUrl(
  //   currentTheme
  // )}`;
  const localStickerPath = resolveLocalStickerPath(currentTheme);
  const localWallpaperPath = resolveLocalWallpaperPath(currentTheme);
  await Promise.all([
    attemptToUpdateAsset(remoteStickerUrl, localStickerPath),
    // attemptToUpdateAsset(remoteWallpaperUrl, localWallpaperPath),
  ]);

  return {
    stickerDataURL: createCssDokiAssetUrl(localStickerPath),
    backgroundImageURL: createCssDokiAssetUrl(localWallpaperPath),
  };
};

async function attemptToUpdateAsset(
  remoteStickerUrl: string,
  localStickerPath: string
) {
  if (await shouldDownloadNewAsset(remoteStickerUrl, localStickerPath)) {
    await installAsset(remoteStickerUrl, localStickerPath);
    const resolvedBrowserWindow = app.getLastFocusedWindow();
    if (resolvedBrowserWindow) {
      resolvedBrowserWindow.webContents.send(STICKER_UPDATED);
    }
  }
}

const fetchRemoteChecksum = async (remoteAssetUrl: string) => {
  const checksumUrl = `${remoteAssetUrl}.checksum.txt`;
  console.log(`Fetching resource checksum: ${checksumUrl}`);
  const checkSumInputStream = await performGet(checksumUrl);
  return checkSumInputStream.setEncoding("utf8").read();
};

export const resolveLocalStickerPath = (
  currentTheme: DokiTheme,
): string => {
  const safeStickerPath = stickerPathToUrl(currentTheme);
  return path.join(__dirname, "stickers", safeStickerPath);
};

const resolveLocalWallpaperPath = (
  currentTheme: DokiTheme,
): string => {
  const safeStickerPath = wallpaperPathToUrl(currentTheme);
  return path.join(__dirname, "wallpapers", safeStickerPath);
};

const createCssDokiAssetUrl = (localAssetPath: string): string => {
  return `file://${cleanPathToUrl(localAssetPath)}`;
};

function cleanPathToUrl(stickerPath: string) {
  return stickerPath.replace(/\\/g, "/");
}

function stickerPathToUrl(currentTheme: DokiTheme) {
  const stickerPath = currentTheme.sticker;
  return cleanPathToUrl(stickerPath);
}

function wallpaperPathToUrl(currentTheme: DokiTheme) {
  const wallpaperPath = `/${currentTheme.wallpaper}`;
  return cleanPathToUrl(wallpaperPath);
}

function createChecksum(data: Buffer | string): string {
  return crypto.createHash("md5").update(data).digest("hex");
}

const calculateFileChecksum = (filePath: string): string => {
  const fileRead = fs.readFileSync(filePath);
  return createChecksum(fileRead);
};

const fetchLocalChecksum = async (localSticker: string) => {
  return fs.existsSync(localSticker)
    ? calculateFileChecksum(localSticker)
    : "File not downloaded, bruv.";
};

const shouldDownloadNewAsset = async (
  remoteAssetUrl: string,
  localStickerPath: string
): Promise<boolean> => {
  try {
    const remoteChecksum = await fetchRemoteChecksum(remoteAssetUrl);
    const localChecksum = await fetchLocalChecksum(localStickerPath);
    return remoteChecksum !== localChecksum;
  } catch (e) {
    console.error("Unable to check for updates", e);
    return false;
  }
};

function mkdirp(dir: string) {
  if (fs.existsSync(dir)) {
    return true
  }
  const dirname = path.dirname(dir)
  mkdirp(dirname);
  fs.mkdirSync(dir);
}

const downloadRemoteAsset = async (
  remoteAssetUrl: string,
  localDestination: string
) => {
  const parentDirectory = path.dirname(localDestination);
  if (!fs.existsSync(parentDirectory)) {
    mkdirp(parentDirectory);
  }
  console.log(`Downloading remote asset: ${remoteAssetUrl}`);
  const stickerInputStream = await performGet(remoteAssetUrl);
  console.log("Remote asset Downloaded!");
  fs.writeFileSync(localDestination, stickerInputStream.read());
};

async function installAsset(
  remoteAssetUrl: string,
  localAssetPath: string
): Promise<boolean> {
  try {
    await downloadRemoteAsset(remoteAssetUrl, localAssetPath);
    return true;
  } catch (e) {
    console.error(`Unable to install asset ${remoteAssetUrl}!`, e);
  }
  return false;
}
