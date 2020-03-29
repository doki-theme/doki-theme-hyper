import React, { FC } from 'react';
import { Component } from 'react';
import { THEME_STATE } from './reducer';
import { SET_THEME } from './settings';
import { DokiTheme } from './themeTemp';

const passProps = (uid: any, parentProps: any, props: any) => Object.assign(props, {
  [THEME_STATE]: parentProps[THEME_STATE],
});

export const mapTermsState = (state: any, map: any) => {
  return Object.assign(map, {
    [THEME_STATE]: state.ui[THEME_STATE],
  })
};

export const mapHyperState = mapTermsState
export const getTermGroupProps = passProps;
export const getTermProps = passProps;

export const decorateHyper = (Hyper: any) =>
  class HyperDecorator extends Component<any> {
    render() {
      return <Hyper {...this.props} />;
    }
  };

declare global {
  interface Window {
    config: any,
    rpc: any,
    store: any,
  }
}

export const CONFIG_RELOAD = 'CONFIG_RELOAD';
export function reloadConfig(config: any) {
  const now = Date.now();
  return {
    type: CONFIG_RELOAD,
    config,
    now
  };
}

export const decorateTerm = (Term: any) =>
  class TerminalDecorator extends Component {
    componentDidMount() {
      window.rpc.on(SET_THEME, (theme: any) => {
        window.store.dispatch({
          type: SET_THEME,
          payload: theme,
        });
        window.store.dispatch(reloadConfig(
          window.config.getConfig()
        ));
      });
    }

    render() {
      // @ts-ignore
      const dokiTheme: DokiTheme = this.props[THEME_STATE].activeTheme;
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {React.createElement(Term, Object.assign({}, this.props))}
          <div style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            color: 'black'
          }}>
            <img src={dokiTheme.sticker} />
          </div>
        </div>
      )
    }
  }
