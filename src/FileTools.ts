import path from "path";
import fs from "fs";

function mkdirp(dir: string) {
  if (fs.existsSync(dir)) {
    return true
  }
  const dirname = path.dirname(dir)
  mkdirp(dirname);
  fs.mkdirSync(dir);
}

export function createParentDirectories(localDestination: string) {
  const parentDirectory = path.dirname(localDestination);
  if (!fs.existsSync(parentDirectory)) {
    mkdirp(parentDirectory);
  }
}
