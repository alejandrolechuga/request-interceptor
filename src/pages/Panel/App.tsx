import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { setPatched } from '../../store/settingsSlice';
import InterceptToggleButton from '../../components/InterceptToggleButton';

import RuleList from '../../components/RuleList';
import RuleForm from '../../components/RuleForm';

type ViewState = 'list' | 'edit' | 'add';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [editId, setEditId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const patched = useAppSelector((state) => state.settings.patched);
  const monkeyStatus = patched ? '🐵' : '🙈';
  return (
    <div className="min-h-screen space-y-4 bg-zinc-800 p-4 text-white">
      <h1 className="text-2xl font-bold">HTTPMocky {monkeyStatus}</h1>
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
      <button
        type="button"
        onClick={() =>
          window.open('https://forms.gle/FNwNhwUvUAiRdzBo9', '_blank')
        }
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '8px 12px',
          backgroundColor: '#e74c3c',
          color: '#fff',
          borderRadius: '4px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      >
        Report a Bug
      </button>
    </div>
  );
};

export default App;
