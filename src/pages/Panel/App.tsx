import React, { useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setEnableRuleset } from '../../store/settingsSlice';

import './app.css';
import RuleTable from '../../components/RuleTable';
import mockData from '../../mocks/rules.json';
import Filter from '../../components/Filter';

const App: React.FC = () => {
  const [filter, setFilter] = useState('');
  const dispatch = useAppDispatch();
  const enableRuleset = useAppSelector((state) => state.settings.enableRuleset);

  const filteredRules = useMemo(() => {
    if (!filter) return mockData;
    return mockData.filter((rule) =>
      rule.urlPattern.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter]);

  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <label>
        <input
          type="checkbox"
          checked={enableRuleset}
          onChange={(e) => dispatch(setEnableRuleset(e.target.checked))}
        />
        Enable rules
      </label>
      <Filter value={filter} onFilterChange={setFilter} />
      <div data-testid="app-container">
        <RuleTable rules={filteredRules} />
      </div>
    </div>
  );
};

export default App;
