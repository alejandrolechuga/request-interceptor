import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store';
import { addRule, updateRule } from '../Panel/ruleset/rulesetSlice';
import OptionsFields from './OptionsFields';

interface RuleFormProps {
  mode: 'add' | 'edit';
  ruleId?: string;
  onBack: () => void;
}

interface MatchingFieldsProps {
  urlPattern: string;
  setUrlPattern: (value: string) => void;
  isRegExp: boolean;
  setIsRegExp: (value: boolean) => void;
  patternError: string | null;
  method: string;
  setMethod: (value: string) => void;
}

const MatchingFields: React.FC<MatchingFieldsProps> = ({
  urlPattern,
  setUrlPattern,
  isRegExp,
  setIsRegExp,
  patternError,
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
      {patternError && (
        <span className="text-sm text-red-500">{patternError}</span>
      )}
    </label>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={isRegExp}
        onChange={(e) => setIsRegExp(e.target.checked)}
      />
      Treat as RegExp
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
  response: string;
  setResponse: (value: string) => void;
  statusCode: number;
  setStatusCode: (value: number) => void;
}

const OverrideFields: React.FC<OverrideFieldsProps> = ({
  response,
  setResponse,
  statusCode,
  setStatusCode,
}) => (
  <fieldset className="flex flex-col gap-2 rounded border p-2">
    <legend className="text-sm font-semibold">Override Response</legend>
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
  const [isRegExp, setIsRegExp] = useState(false);
  const [method, setMethod] = useState('');
  const [enabled, setEnabled] = useState(true);
  const [delayMs, setDelayMs] = useState<number | null>(null);
  const [response, setResponse] = useState('');
  const [statusCode, setStatusCode] = useState(200);
  const [patternError, setPatternError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && existing) {
      setUrlPattern(existing.urlPattern);
      setIsRegExp(existing.isRegExp ?? false);
      setMethod(existing.method);
      setEnabled(existing.enabled);
      setResponse(existing.response || '');
      setStatusCode(existing.statusCode ?? 200);
      setDelayMs(existing.delayMs ?? null);
    }
  }, [existing, mode]);

  const isValidRegExp = (pattern: string): boolean => {
    try {
      new RegExp(pattern);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    if (isRegExp) {
      setPatternError(
        isValidRegExp(urlPattern) ? null : 'Invalid RegExp pattern'
      );
    } else {
      setPatternError(null);
    }
  }, [isRegExp, urlPattern]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patternError) {
      return;
    }
    if (mode === 'add') {
      dispatch(
        addRule({
          urlPattern,
          isRegExp,
          method,
          enabled,
          date: new Date().toISOString().split('T')[0],
          response,
          statusCode,
          delayMs,
        })
      );
    } else if (mode === 'edit' && ruleId) {
      dispatch(
        updateRule({
          id: ruleId,
          changes: {
            urlPattern,
            isRegExp,
            method,
            enabled,
            response,
            statusCode,
            delayMs,
          },
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
          isRegExp={isRegExp}
          setIsRegExp={setIsRegExp}
          patternError={patternError}
          method={method}
          setMethod={setMethod}
        />
        <OptionsFields
          enabled={enabled}
          setEnabled={setEnabled}
          delayMs={delayMs ?? null}
          setDelayMs={setDelayMs}
        />
        <OverrideFields
          response={response}
          setResponse={setResponse}
          statusCode={statusCode}
          setStatusCode={setStatusCode}
        />
      </div>
      <div className="space-x-2">
        <button
          type="submit"
          className="rounded bg-blue-500 px-2 py-1"
          disabled={!!patternError}
        >
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
