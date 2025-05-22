import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setEnableRuleset } from '../../store/settingsSlice';
import { addRule } from '../../Panel/ruleset/rulesetSlice';
import { RuntimeMessage } from '../../types/messages';

import './app.css';
import RuleTable from '../../components/RuleTable';
import mockData from '../../mocks/rules.json';
import Filter from '../../components/Filter';

const App: React.FC = () => {
  const [filter, setFilter] = useState('');
  const dispatch = useAppDispatch();
  const enableRuleset = useAppSelector((state) => state.settings.enableRuleset);
  const rules = useAppSelector((state) => state.ruleset);

  useEffect(() => {
    console.log('Enable ruleset:', enableRuleset);
    chrome.tabs.sendMessage(
      chrome.devtools.inspectedWindow.tabId,
      {
        action: RuntimeMessage.SETTINGS_UPDATE,
        settings: { enableRuleset },
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error('SendMessage error:', chrome.runtime.lastError);
        } else {
          console.log('Got response:', response);
        }
      }
    );
  }, [enableRuleset]);

  // Temporary: preload mock rules into the store once
  useEffect(() => {
    if (rules.length === 0) {
      mockData.forEach(({ id: _ignored, ...data }) => dispatch(addRule(data)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        <RuleTable filter={filter} />
      </div>
    </div>
  );
};

export default App;
