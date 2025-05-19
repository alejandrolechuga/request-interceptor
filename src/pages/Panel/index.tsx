import React from 'react';

import { createRoot } from 'react-dom/client';

import App from './App';
import './index.css';

const container = document.getElementById('app-container');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('App container not found');
}
