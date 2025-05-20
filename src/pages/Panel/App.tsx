import React from 'react';

import './App.css';
import RuleTable from '../../components/RuleTable';
import mockData from '../../mocks/rules.json';

const App: React.FC = () => {
  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <div data-testid="app-container">
        <RuleTable rules={mockData} />
      </div>
    </div>
  );
};

export default App;
