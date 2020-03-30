
export const CYCLE_THEME = 'dokiTheme:nextTheme'
export const decorateKeymaps = (keymaps: any) => {
  const newKeymaps = {
    [CYCLE_THEME]: 'ctrl+alt+n',
  }
  return Object.assign({}, keymaps, newKeymaps);
}