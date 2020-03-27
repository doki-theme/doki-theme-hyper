import React, { FC } from 'react';
import { Component } from 'react';
import { THEME_STATE } from './reducer';

const passProps = (uid: any, parentProps: any, props: any) => Object.assign(props, {
  [THEME_STATE]: parentProps[THEME_STATE],
});

export const mapTermsState = (state: any, map: any) => Object.assign(map, {
  [THEME_STATE]: state.ui[THEME_STATE],
});

export const mapHyperTermState = mapTermsState
export const getTermGroupProps = passProps;
export const getTermProps = passProps;

export const decorateHyper = (Hyper: any) =>
  class HyperDecorator extends Component<any> {

    render() {
      return <Hyper {...this.props} customChildren={<div style={{
        position: 'fixed',
        top: 0,
        right: 0,
        color: 'red',
      }}>yeet</div>} />;
    }
  };

export const decorateTerm = (Term: any) =>
  class TerminalDecorator extends Component {
    render() {
      return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          {React.createElement(Term, Object.assign({}, this.props))}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            color: 'black'
          }}>YYYEEEEEEEEEEEET!!!!</div>
        </div>
      )
    }
  }