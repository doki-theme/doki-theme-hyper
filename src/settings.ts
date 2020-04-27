import DokiThemeDefinitions from "./DokiThemeDefinitions";
import {extractConfig, saveConfig} from "./config";
import {dialog} from 'electron';
import path from 'path';
import AppInitialization from "./AppInitialization";

export const SET_THEME = 'SET_THEME'
export const TOGGLE_STICKER = 'TOGGLE_STICKER';
export const STICKER_UPDATED = 'STICKER_UPDATED';

const themes = Object.values(DokiThemeDefinitions)
  .map(dokiDefinition => {
    return {
      label: dokiDefinition.information.name,
      click: async (_: any, focusedWindow: any) => {
        saveConfig(
          {
            ...extractConfig(),
            themeId: dokiDefinition.information.id
          }
        )
        focusedWindow.rpc.emit(SET_THEME, dokiDefinition);
        setTimeout(() => {
          // triggers event loop to continue download?
          focusedWindow.rpc.emit('refresh');
        }, 500);
      }
    }
  });

export const VERSION = 'v2.0.2';
const appName = 'Doki Theme';
const icon = path.resolve(__dirname, '..', 'assets', 'Doki-Theme.png');
const showAbout = () => {
  dialog.showMessageBox({
    title: `About ${appName}`,
    message: `${appName} ${VERSION}`,
    detail: `Thanks for downloading The Doki Theme for Hyper!`,
    buttons: ['K Thx'],
    // @ts-ignore
    icon
  });
};

const getAboutMenu = () => {
  if (process.platform !== 'darwin') {
    return {
      role: 'about',
      click() {
        showAbout();
      }
    }
  }

  return {
    label: 'About Plugin',
    submenu: [
      {
        label: `Version ${VERSION}`,
      }
    ]
  }
};

export default (menu: any) => {
  AppInitialization();
  const menuItem = {
    id: 'Doki-Theme',
    label: 'Doki-Theme Settings',
    commandId: 1969,
    checked: false,
    enabled: true,
    role: 'help',
    submenu: [
      {
        id: 'Themes',
        label: 'Themes',
        commandId: 1969,
        checked: false,
        enabled: true,
        role: 'help',
        submenu: themes,
      },
      {
        label: 'Toggle Sticker',
        click: async (_: any, focusedWindow: Window) => {
          focusedWindow.rpc.emit(TOGGLE_STICKER);
          const savedConfig = extractConfig();
          saveConfig(
            {
              ...savedConfig,
              showSticker: !savedConfig.showSticker
            }
          )
        }
      },
      getAboutMenu(),
      {
        label: 'View ChangeLog',
        click: async () => {
          const {shell} = require('electron');
          await shell.openExternal('https://github.com/Unthrottled/doki-theme-hyper/blob/master/CHANGELOG.md')
        }
      }
    ]
  };

  return [
    ...menu,
    menuItem
  ]
};
