import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setEnableRuleset } from '../../store/settingsSlice';

import RuleList from '../../components/RuleList';
import RuleForm from '../../components/RuleForm';

type ViewState = 'list' | 'edit' | 'add';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const enableRuleset = useAppSelector((state) => state.settings.enableRuleset);

  return (
    <div className="min-h-screen space-y-4 bg-zinc-800 p-4 text-white">
      <h1 className="text-2xl font-bold">Override Response Tool</h1>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={enableRuleset}
          onChange={(e) => dispatch(setEnableRuleset(e.target.checked))}
        />
        Apply Rules
      </label>
      <div data-testid="app-container">
        {view === 'list' && (
          <RuleList
            onEdit={(id) => {
              setEditId(id);
              setView('edit');
            }}
            onAdd={() => setView('add')}
          />
        )}

        {view === 'edit' && (
          <RuleForm
            mode="edit"
            ruleId={editId || undefined}
            onBack={() => setView('list')}
          />
        )}

        {view === 'add' && (
          <RuleForm mode="add" onBack={() => setView('list')} />
        )}
      </div>
    </div>
  );
};

export default App;
