import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setPatched } from '../../store/settingsSlice';

import RuleList from '../../components/RuleList';
import RuleForm from '../../components/RuleForm';

type ViewState = 'list' | 'edit' | 'add';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const patched = useAppSelector((state) => state.settings.patched);

  return (
    <div className="min-h-screen space-y-4 bg-zinc-800 p-4 text-white">
      <h1 className="text-2xl font-bold">Override Response Tool</h1>
      <button
        type="button"
        onClick={() => dispatch(setPatched(!patched))}
        className={`rounded px-2 py-1 ${patched ? 'bg-green-600' : 'bg-gray-600'}`}
      >
        {patched ? 'Interception Enabled' : 'Enable Interception'}
      </button>
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
