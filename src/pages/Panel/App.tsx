import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setEnableRuleset } from '../../store/settingsSlice';
import { addRule } from '../../Panel/ruleset/rulesetSlice';

import RuleTable from '../../components/RuleTable';
import mockData from '../../mocks/rules.json';
import Filter from '../../components/Filter';

const App: React.FC = () => {
  const [filter, setFilter] = useState('');
  const dispatch = useAppDispatch();
  const enableRuleset = useAppSelector((state) => state.settings.enableRuleset);
  const rules = useAppSelector((state) => state.ruleset);

  // Temporary: preload mock rules into the store once
  useEffect(() => {
    if (rules.length === 0) {
      mockData.forEach(({ id: _ignored, ...data }) => dispatch(addRule(data)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen space-y-4 bg-zinc-800 p-4 text-white">
      <h1 className="text-2xl font-bold">Dev Tools Panel</h1>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enableRuleset}
          onChange={(e) => dispatch(setEnableRuleset(e.target.checked))}
        />
        Enable rules
      </label>
      <Filter value={filter} onFilterChange={setFilter} />
      <div data-testid="app-container">
        <RuleTable filter={filter} />
      </div>
    </div>
  );
};

export default App;
