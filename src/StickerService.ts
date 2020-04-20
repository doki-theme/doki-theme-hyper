import path from 'path';
import fs from "fs";
import {isStickerNotCurrent, resolveLocalStickerPath, StickerUpdateStatus} from "./StickerUpdateService";
import {performGet} from "./RESTClient";
import {VSCODE_ASSETS_URL} from "./ENV";
import {DokiTheme} from './themeTemp';

function mkdirp(dir: string) {
  if (fs.existsSync(dir)) {
    return true
  }
  const dirname = path.dirname(dir)
  mkdirp(dirname);
  fs.mkdirSync(dir);
}

const downloadSticker = async (stickerPath: string, localDestination: string) => {
  const parentDirectory = path.dirname(localDestination);
  if (!fs.existsSync(parentDirectory)) {
    mkdirp(parentDirectory);
  }

  const stickerUrl = `${VSCODE_ASSETS_URL}${stickerPath}`;
  console.log(`Downloading image: ${stickerUrl}`);
  const stickerInputStream = await performGet(stickerUrl);
  console.log('Image downloaded');
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
