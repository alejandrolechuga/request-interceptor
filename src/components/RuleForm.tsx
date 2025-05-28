import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { addRule, updateRule } from '../Panel/ruleset/rulesetSlice';

interface RuleFormProps {
  mode: 'add' | 'edit';
  ruleId?: string;
  onBack: () => void;
}

interface MatchingFieldsProps {
  urlPattern: string;
  setUrlPattern: (value: string) => void;
  method: string;
  setMethod: (value: string) => void;
}

const MatchingFields: React.FC<MatchingFieldsProps> = ({
  urlPattern,
  setUrlPattern,
  method,
  setMethod,
}) => (
  <fieldset className="flex flex-col gap-2 rounded border p-2">
    <legend className="text-sm font-semibold">Matching</legend>
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
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        className="rounded border border-gray-300 px-2 py-1 text-black"
      >
        <option value="">Match All</option>
        {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </label>
  </fieldset>
);

interface OverrideFieldsProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
  response: string;
  setResponse: (value: string) => void;
  statusCode: number;
  setStatusCode: (value: number) => void;
}

const OverrideFields: React.FC<OverrideFieldsProps> = ({
  enabled,
  setEnabled,
  response,
  setResponse,
  statusCode,
  setStatusCode,
}) => (
  <fieldset className="flex flex-col gap-2 rounded border p-2">
    <legend className="text-sm font-semibold">Override</legend>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      Enabled
    </label>
    <label className="flex flex-col">
      <span>Response Body</span>
      <textarea
        rows={4}
        value={response}
        onChange={(e) => setResponse(e.target.value)}
        placeholder="Leave empty to use the original response"
        className="rounded border border-gray-300 px-2 py-1 text-black"
      />
    </label>
    <label className="flex flex-col">
      <span>Status Code</span>
      <input
        type="number"
        value={statusCode}
        onChange={(e) => setStatusCode(Number(e.target.value))}
        className="rounded border border-gray-300 px-2 py-1 text-black"
      />
    </label>
  </fieldset>
);

const RuleForm: React.FC<RuleFormProps> = ({ mode, ruleId, onBack }) => {
  const dispatch = useAppDispatch();
  const existing = useAppSelector((state) =>
    state.ruleset.find((r) => r.id === ruleId)
  );

  const [urlPattern, setUrlPattern] = useState('');
  const [method, setMethod] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [response, setResponse] = useState('');
  const [statusCode, setStatusCode] = useState(200);

  useEffect(() => {
    if (mode === 'edit' && existing) {
      setUrlPattern(existing.urlPattern);
      setMethod(existing.method);
      setEnabled(existing.enabled);
      setResponse(existing.response || '');
      setStatusCode(existing.statusCode ?? 200);
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
          response,
          statusCode,
        })
      );
    } else if (mode === 'edit' && ruleId) {
      dispatch(
        updateRule({
          id: ruleId,
          changes: { urlPattern, method, enabled, response, statusCode },
        })
      );
    }
    onBack();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">
        {mode === 'edit' ? 'Edit Rule' : 'Add Rule'}
      </h2>
      <div className="flex flex-col gap-4">
        <MatchingFields
          urlPattern={urlPattern}
          setUrlPattern={setUrlPattern}
          method={method}
          setMethod={setMethod}
        />
        <OverrideFields
          enabled={enabled}
          setEnabled={setEnabled}
          response={response}
          setResponse={setResponse}
          statusCode={statusCode}
          setStatusCode={setStatusCode}
        />
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
