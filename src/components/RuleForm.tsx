import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { addRule, updateRule } from '../Panel/ruleset/rulesetSlice';

interface RuleFormProps {
  mode: 'add' | 'edit';
  ruleId?: string;
  onBack: () => void;
}

const RuleForm: React.FC<RuleFormProps> = ({ mode, ruleId, onBack }) => {
  const dispatch = useAppDispatch();
  const existing = useAppSelector((state) =>
    state.ruleset.find((r) => r.id === ruleId)
  );

  const [urlPattern, setUrlPattern] = useState('');
  const [method, setMethod] = useState('GET');
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (mode === 'edit' && existing) {
      setUrlPattern(existing.urlPattern);
      setMethod(existing.method);
      setEnabled(existing.enabled);
    }
  }, [existing, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'add') {
      dispatch(
        addRule({
          urlPattern,
          method,
          enabled,
          date: new Date().toISOString().split('T')[0],
          response: null,
        })
      );
    } else if (mode === 'edit' && ruleId) {
      dispatch(
        updateRule({ id: ruleId, changes: { urlPattern, method, enabled } })
      );
    }
    onBack();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">
        {mode === 'edit' ? 'Edit Rule' : 'Add Rule'}
      </h2>
      <div className="flex flex-col gap-2">
        <label className="flex flex-col">
          <span>URL Pattern</span>
          <input
            type="text"
            value={urlPattern}
            onChange={(e) => setUrlPattern(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-black"
          />
        </label>
        <label className="flex flex-col">
          <span>Method</span>
          <input
            type="text"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-black"
          />
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enabled
        </label>
      </div>
      <div className="space-x-2">
        <button type="submit" className="rounded bg-blue-600 px-2 py-1">
          Save
        </button>
        <button
          type="button"
          onClick={onBack}
          className="rounded bg-gray-600 px-2 py-1"
        >
          Back
        </button>
      </div>
    </form>
  );
};

export default RuleForm;
