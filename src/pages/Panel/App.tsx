import React, { useState, useMemo } from 'react';

import './app.css';
import RuleTable from '../../components/RuleTable';
import mockData from '../../mocks/rules.json';
import Filter from '../../components/Filter';

const App: React.FC = () => {
  const [filter, setFilter] = useState('');

  const filteredRules = useMemo(() => {
    if (!filter) return mockData;
    return mockData.filter((rule) =>
      rule.urlPattern.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <Filter value={filter} onFilterChange={setFilter} />
      <div data-testid="app-container">
        <RuleTable rules={filteredRules} />
      </div>
    </div>
  );
};

export default App;
