import React from 'react';

import './Panel.css';
import NetworkTable from '../../components/NetworkTable';
import mockData from '../../mocks/requests.json';

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <div data-testid="app-container">
        <NetworkTable requests={mockData} />
      </div>
    </div>
  );
};

export default App;
