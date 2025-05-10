import React from 'react';
import logo from '../../assets/img/logo.svg';
import './Newtab.css';
import './Newtab.scss';
const Newtab = () => {
  return React.createElement(
    'div',
    { className: 'App' },
    React.createElement(
      'header',
      { className: 'App-header' },
      React.createElement('img', {
        src: logo,
        className: 'App-logo',
        alt: 'logo',
      }),
      React.createElement(
        'p',
        null,
        'Edit ',
        React.createElement('code', null, 'src/pages/Newtab/Newtab.js'),
        ' and save to reload.'
      ),
      React.createElement(
        'a',
        {
          className: 'App-link',
          href: 'https://reactjs.org',
          target: '_blank',
          rel: 'noopener noreferrer',
        },
        'Learn React!'
      ),
      React.createElement(
        'h6',
        null,
        'The color of this paragraph is defined using SASS.'
      )
    )
  );
};
export default Newtab;
