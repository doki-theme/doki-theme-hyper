import React, { FC } from 'react';
import { Component } from 'react';


export const decorateHyper = (Hyper: any) =>
  class HyperDecorator extends Component {

    render() {
      console.log('yeeett!!!!');

      return <Hyper {...this.props} customChildren={<div>yeet</div>} />;
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