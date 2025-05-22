import React from 'react';

import logo from '../../assets/img/logo.svg';

const Popup = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center space-y-4 bg-gray-800 p-4 text-center text-white">
      <img src={logo} className="h-24 w-24 animate-spin" alt="logo" />
      <p>
        Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
      </p>
      <a
        className="text-blue-400 hover:underline"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React!
      </a>
    </div>
  );
};

export default Popup;
