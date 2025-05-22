import React from 'react';
import logo from '../../assets/img/logo.svg';

const Newtab = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gray-800 p-4 text-center text-white">
      <img src={logo} className="h-32 w-32 animate-spin" alt="logo" />
      <p>
        Edit <code>src/pages/Newtab/Newtab.js</code> and save to reload.
      </p>
      <a
        className="text-blue-400 hover:underline"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React!
      </a>
      <h6 className="text-orange-500">
        The color of this paragraph is defined using SASS.
      </h6>
    </div>
  );
};

export default Newtab;
