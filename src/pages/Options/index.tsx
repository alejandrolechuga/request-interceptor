import React from 'react';

import { createRoot } from 'react-dom/client';

import Options from './Options';
import './index.css';
import '../../styles/globals.css';

const container = document.getElementById('app-container');
if (container) {
  const root = createRoot(container);
  root.render(<Options title={'Settings'} />);
} else {
  console.error('App container not found');
}
