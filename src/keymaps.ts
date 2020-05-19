
export const decorateKeymaps = (keymaps: any) => {
  console.log('decorating keymaps');
  return Object.assign({}, keymaps, {
    "doki-theme:cycle-forward": "alt+shift+q",
    "doki-theme:cycle-backward": "alt+shift+;",
  })
}
