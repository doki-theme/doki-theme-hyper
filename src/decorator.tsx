import React, {Component} from "react";
import {THEME_STATE, ThemeState} from "./reducer";
import {
  SET_STICKER_TYPE,
  SET_THEME,
  STICKER_UPDATED,
  SYSTEM_THEME_CHANGED,
  TOGGLE_FONT,
  TOGGLE_STICKER,
  TOGGLE_WALLPAPER,
} from "./settings";
import path from "path";
import {attemptToUpdateSticker, resolveLocalStickerPath} from "./StickerUpdateService";
import {ipcRenderer} from "electron";

const passProps = (uid: any, parentProps: any, props: any) =>
  Object.assign(props, {
    [THEME_STATE]: parentProps[THEME_STATE],
  });

export const mapTermsState = (state: any, map: any) => {
  return Object.assign(map, {
    [THEME_STATE]: state.ui[THEME_STATE],
  });
};

export const mapHyperState = mapTermsState;
export const getTermGroupProps = passProps;
export const getTermProps = passProps;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const decorateHyper = (Hyper: any) =>
  class HyperDecorator extends Component<any> {
    render() {
      return <Hyper {...this.props} />;
    }
  };

declare global {
  interface Window {
    config: any;
    rpc: any;
    store: any;
  }

  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Electron {
    interface App {
      getWindows: () => BrowserWindow[];
      getLastFocusedWindow: () => BrowserWindow;
    }

    interface BrowserWindow {
      rpc: any;
    }
  }
}

export const CONFIG_RELOAD = "CONFIG_RELOAD";

export function reloadConfig(config: any) {
  const now = Date.now();
  return {
    type: CONFIG_RELOAD,
    config,
    now,
  };
}

interface StickerState {
  imageLoaded: boolean;
}

const createCacheBuster = () => new Date().valueOf().toString(32);

let initialized = false;

const mediaQuery = "(prefers-color-scheme: dark)";

/**
 * Just in case you forget, all the terminal ui changes
 * happen in the Redux Store that only lives inside the
 * Electron Window app.
 *
 * So things outside the decorator don't have access to the Redux Store.
 * Which is a pain in the ass. So stuff outside of Redux uses config files.
 *
 * Things like the settings emit events that this decorator listens to and
 * emits the corresponding events to create a new state.
 *
 * Anytime that those changes happen, I also need to reload the configuration
 * to force update all the other crap in index.ts, which causes things to
 * change.
 *
 * This code base looks stupid, because it is stupid.
 *
 * Love,
 *
 * Past Alex
 */
export const decorateTerm = (Term: any) => {
  let cacheBuster: string = createCacheBuster();
  return class TerminalDecorator extends Component<any, StickerState> {
    state = {
      imageLoaded: false,
    };

    private static imageError() {
      cacheBuster = createCacheBuster();
    }

    private static constructStickerUrl(
      themeState: ThemeState
    ): string | undefined {
      const localStickerPath = resolveLocalStickerPath(
        themeState.currentSticker.sticker
      ).replace(path.sep, "/");
      return `${localStickerPath}?time=${cacheBuster}`;
    }

    private mediaChangeListener = TerminalDecorator.handleMediaChange.bind(this);

    private static handleMediaChange() {
      window.store.dispatch({
        type: SYSTEM_THEME_CHANGED,
        payload: {
          isDark: TerminalDecorator.isDark(),
        }
      });
      // this refreshes the entire application so
      // the new theme gets picked up.
      window.store.dispatch(reloadConfig(window.config.getConfig()));
    }

    public static isDark() {
      return window.matchMedia(mediaQuery).matches;
    }


    componentDidMount() {
      if (!initialized) {
        this.registerListener(SET_THEME);
        this.registerListener(SET_STICKER_TYPE);
        this.registerListener(STICKER_UPDATED);
        this.registerListener(TOGGLE_WALLPAPER);
        window.rpc.on(TOGGLE_FONT, () => {
          window.store.dispatch(reloadConfig(window.config.getConfig()));
        });
        ipcRenderer.on(STICKER_UPDATED, () => {
          this.forceUpdate();
          window.store.dispatch({
            type: "RE_RENDER_PLZ",
          });
        });
        window.rpc.on(TOGGLE_STICKER, () => {
          window.store.dispatch({
            type: TOGGLE_STICKER,
          });
        });
        window.rpc.on(TOGGLE_WALLPAPER, () => {
          window.store.dispatch({
            type: TOGGLE_WALLPAPER,
          });
        });
        // dispatch to initialize system state.
        TerminalDecorator.handleMediaChange();
        window
            .matchMedia(mediaQuery)
            .addEventListener("change", this.mediaChangeListener);
        initialized = true;
      }
    }

    private registerListener(event: string) {
      window.rpc.on(event, (eventPayload: any) => {
        window.store.dispatch({
          type: event,
          payload: eventPayload,
        });
        window.store.dispatch(reloadConfig(window.config.getConfig()));
        ipcRenderer.send(event, eventPayload);
      });
    }

    componentWillReceiveProps(nextProps: any) {
      const themeState: ThemeState = this.props[THEME_STATE];
      const nextThemeState: ThemeState = nextProps[THEME_STATE];
      if (
        themeState.currentSticker.sticker.path !==
        nextThemeState.currentSticker.sticker.path
      ) {
        this.setState({ imageLoaded: false });
        cacheBuster = createCacheBuster();
      }

      if(themeState.activeTheme.information.id !=
        nextThemeState.activeTheme.information.id) {
        // if user updates config, that causes a potential theme change
        // eg. if system is dark and they change dark theme. The config
        // change causes the active theme to change. When the theme
        // changes on config reload, the CSS has already been decorated.
        // CSS decoration is how the terminal is themed. So the terminal
        // was decorated with the previous theme (the initial config reload
        // triggered by the user). So dispatch a config reload again,
        // to pick up the latest theme changes.
        window.store.dispatch(reloadConfig(window.config.getConfig()));
        attemptToUpdateSticker().then(() => {
          window.store.dispatch(reloadConfig(window.config.getConfig()))
        });
      }
    }

    render() {
      const themeState: ThemeState = this.props[THEME_STATE];

      const imageStyle =
        window.screen.width <= 1920
          ? { maxHeight: "200px", maxWidth: "175px" }
          : {};
      return (
        <div style={{ width: "100%", height: "100%", position: "relative" }}>
          {React.createElement(Term, Object.assign({}, this.props))}
          <div
            style={{
              position: "absolute",
              bottom: "0.5rem",
              right: "0.5rem",
              color: "black",
            }}
          >
            {themeState.showSticker ? (
              <img
                style={
                  this.state.imageLoaded ? imageStyle : { display: "none" }
                }
                onLoad={() => this.setLoaded()}
                onError={() => TerminalDecorator.imageError()}
                src={TerminalDecorator.constructStickerUrl(themeState)}
                alt={themeState.currentSticker.sticker.name}
              />
            ) : (
              <></>
            )}
          </div>
        </div>
      );
    }

    private setLoaded() {
      this.setState({ imageLoaded: true });
    }
  };
};
