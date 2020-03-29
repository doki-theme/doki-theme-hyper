import DokiThemeDefinitions from "./DokiThemeDefinitions";

export const SET_THEME = 'SET_THEME'
import { saveConfig, extractConfig } from "./config";
const themes = Object.values(DokiThemeDefinitions)
.map(dokiDefinition => {
  return {
    label: dokiDefinition.information.name,
    click: async (_: any, focusedWindow: any) => {
      focusedWindow.rpc.emit(SET_THEME, dokiDefinition);
      saveConfig(
        {
          ...extractConfig(),
          themeId: dokiDefinition.information.id
        }
      )
    }
  }
});

export default (menu:any) => {
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
        click: async () => {
          // todo: toggle sticker
        }
      },
      {
        label: 'View ChangeLog',
        click: async () => {
          const { shell } = require('electron')
          await shell.openExternal('https://github.com/Unthrottled/doki-theme-hyper/blob/master/CHANGELOG.md')
        }
      },
    ]
  };

  return [
    ...menu,
    menuItem    
  ]
}