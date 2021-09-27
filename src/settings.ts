import DokiThemeDefinitions from "./DokiThemeDefinitions";
import {extractConfig, saveConfig} from "./config";
import {dialog} from "electron";
import path from "path";
import {attemptToUpdateSticker} from "./StickerUpdateService";
import {StickerType, StringDictonary} from "./themeTools";

export const SET_THEME = "SET_THEME";
export const SET_STICKER_TYPE = "SET_STICKER_TYPE";
export const TOGGLE_STICKER = "TOGGLE_STICKER";
export const TOGGLE_WALLPAPER = "TOGGLE_WALLPAPER";
export const TOGGLE_FONT = "TOGGLE_FONT";
export const STICKER_UPDATED = "STICKER_UPDATED";

function attemptToDoStickerStuff(focusedWindow: any) {
  attemptToUpdateSticker().then(() => {
    focusedWindow.rpc.emit(STICKER_UPDATED)
  });
  setTimeout(() => {
    // triggers event loop to continue download?
    focusedWindow.rpc.emit("refresh");
  }, 500);
}

const stickerTypeMenus = [
  {
    name: "Primary",
    type: StickerType.DEFAULT,
  },
  {
    name: "Secondary",
    type: StickerType.SECONDARY,
  },
].map(({name, type}) => {
  return {
    label: name,
    click: async (_: any, focusedWindow: any) => {
      saveConfig({
        ...extractConfig(),
        stickerType: type,
      });
      focusedWindow.rpc.emit(SET_STICKER_TYPE, type);
      attemptToDoStickerStuff(focusedWindow);
    },
  };
});

const themes = Object.values(DokiThemeDefinitions)
  .sort((def1, def2) => def1.information.name.localeCompare(def2.information.name))
  .map((dokiDefinition) => {
    return {
      label: dokiDefinition.information.name,
      click: async (_: any, focusedWindow: any) => {
        saveConfig({
          ...extractConfig(),
          themeId: dokiDefinition.information.id,
        });
        focusedWindow.rpc.emit(SET_THEME, dokiDefinition);
        attemptToDoStickerStuff(focusedWindow);
      },
    };
  });

export const VERSION = "v14.0.0";
const icon = path.resolve(__dirname, "..", "assets", "Doki-Theme.png");
const showAbout = () => {
  const appName = "Doki Theme";
  dialog.showMessageBox({
    title: `About ${appName}`,
    message: `${appName} ${VERSION}`,
    detail: `Thanks for downloading The Doki Theme for Hyper!`,
    buttons: ["K Thx"],
    // @ts-ignore
    icon,
  });
};

const getAboutMenu = () => {
  if (process.platform !== "darwin") {
    return {
      label: "About Plugin",
      click() {
        showAbout();
      },
    };
  }

  return {
    label: "About Plugin",
    submenu: [
      {
        label: `Version ${VERSION}`,
      },
    ],
  };
};

export default (providedMenu: any): StringDictonary<any> => {
  const menuItem = {
    id: "Doki-Theme",
    label: "Doki-Theme Settings",
    commandId: 1969,
    checked: false,
    enabled: true,
    role: "help",
    submenu: [
      {
        id: "Themes",
        label: "Themes",
        commandId: 1969,
        checked: false,
        enabled: true,
        role: "help",
        submenu: themes,
      },
      {
        id: "StickerType",
        label: "Sticker Type",
        commandId: 1985,
        checked: false,
        enabled: true,
        submenu: stickerTypeMenus,
      },
      {
        label: "Toggle Sticker",
        click: async (_: any, focusedWindow: Window) => {
          const savedConfig = extractConfig();
          const showSticker = !savedConfig.showSticker;
          focusedWindow.rpc.emit(TOGGLE_STICKER);
          saveConfig({
            ...savedConfig,
            showSticker,
          });
        },
      },
      {
        label: "Toggle Wallpaper",
        click: async (_: any, focusedWindow: Window) => {
          const savedConfig = extractConfig();
          const showWallpaper = !(savedConfig.showWallpaper || savedConfig.showWallpaper == undefined);
          focusedWindow.rpc.emit(TOGGLE_WALLPAPER);
          saveConfig({
            ...savedConfig,
            showWallpaper,
          });
        },
      },
      {
        label: "Toggle Fonts",
        click: async (_: any, focusedWindow: Window) => {
          const savedConfig = extractConfig();
          const useFonts = !savedConfig.useFonts;
          saveConfig({
            ...savedConfig,
            useFonts,
          });
          focusedWindow.rpc.emit(TOGGLE_FONT);
        },
      },
      getAboutMenu(),
      {
        label: "View ChangeLog",
        click: async () => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const {shell} = require("electron");
          await shell.openExternal(
            "https://github.com/doki-theme/doki-theme-hyper/blob/master/CHANGELOG.md"
          );
        },
      },
    ],
  };

  return [...providedMenu, menuItem];
};
