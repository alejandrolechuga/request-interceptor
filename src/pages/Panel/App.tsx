import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setPatched } from '../../store/settingsSlice';
import InterceptToggleButton from '../../components/InterceptToggleButton';

import RuleList from '../../components/RuleList';
import RuleForm from '../../components/RuleForm';
import packageJson from '../../../package.json';

type ViewState = 'list' | 'edit' | 'add';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const patched = useAppSelector((state) => state.settings.patched);

  return (
    <div className="min-h-screen space-y-4 bg-zinc-800 p-4 text-white">
      <h1 className="text-2xl font-bold">HTTPMocky v{packageJson.version}</h1>
      <InterceptToggleButton
        isEnabled={patched}
        onToggle={() => dispatch(setPatched(!patched))}
      />
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
