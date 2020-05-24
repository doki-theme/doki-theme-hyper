import { performGet } from "./RESTClient";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { VSCODE_ASSETS_URL } from "./ENV";
import { configDirectory, getTheme } from "./config";
import { app } from "electron";
import { STICKER_UPDATED } from "./settings";
import { Sticker } from "./themeTools";
import { createParentDirectories } from "./FileTools";

export interface DokiStickers {
  stickerDataURL: string;
}

export const attemptToUpdateSticker = async (): Promise<DokiStickers> => {
  const {
    sticker: { sticker: currentSticker },
  } = getTheme();
  const remoteStickerUrl = `${VSCODE_ASSETS_URL}${stickerPathToUrl(
    currentSticker
  )}`;
  const localStickerPath = resolveLocalStickerPath(currentSticker);
  await Promise.all([attemptToUpdateAsset(remoteStickerUrl, localStickerPath)]);

  return {
    stickerDataURL: createCssDokiAssetUrl(localStickerPath),
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

export const resolveLocalStickerPath = (currentSticker: Sticker): string => {
  const safeStickerPath = stickerPathToUrl(currentSticker);
  return path.join(configDirectory, "stickers", safeStickerPath);
};

const createCssDokiAssetUrl = (localAssetPath: string): string => {
  return `file://${cleanPathToUrl(localAssetPath)}`;
};

function cleanPathToUrl(stickerPath: string) {
  return stickerPath.replace(/\\/g, "/");
}

function stickerPathToUrl(currentSticker: Sticker) {
  const stickerPath = currentSticker.path;
  return cleanPathToUrl(stickerPath);
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

const downloadRemoteAsset = async (
  remoteAssetUrl: string,
  localDestination: string
) => {
  createParentDirectories(localDestination);
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
