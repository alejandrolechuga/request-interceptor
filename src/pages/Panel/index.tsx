import React from 'react';
import { createRoot } from 'react-dom/client';

import Panel from './Panel';
import './index.css';

const container = document.getElementById('app-container');
if (container) {
    const root = createRoot(container);
    root.render(<Panel />);
} else {
    console.error('App container not found');
}
