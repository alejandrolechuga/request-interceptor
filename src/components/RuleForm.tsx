import React, { useState, useEffect, useLayoutEffect } from 'react';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../store';
import { addRule, updateRule } from '../Panel/ruleset/rulesetSlice';
import OptionsFields from './OptionsFields';
import { methodSupportsRequestBody } from '../utils/http';
import RequestOverrideFields from './RequestOverrideFields';
import { ResponseOverrideFields } from './ResponseOverrideFields';

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
  urlError?: string;
  methodError?: string;
}

const MatchingFields: React.FC<MatchingFieldsProps> = ({
  urlPattern,
  setUrlPattern,
  isRegExp,
  setIsRegExp,
  patternError,
  method,
  setMethod,
  urlError,
  methodError,
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
      {urlError && <span className="text-sm text-red-500">{urlError}</span>}
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
      {methodError && (
        <span className="text-sm text-red-500">{methodError}</span>
      )}
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
  const [requestBody, setRequestBody] = useState('');
  const [response, setResponse] = useState('');
  const [statusCode, setStatusCode] = useState(200);
  const [patternError, setPatternError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    urlPattern?: string;
    method?: string;
    statusCode?: string;
    response?: string;
    delayMs?: string;
  }>({});

  const prevMethod = React.useRef<string>('');
  const initialized = React.useRef(false);
  useLayoutEffect(() => {
    if (mode === 'edit' && existing) {
      setUrlPattern(existing.urlPattern);
      setIsRegExp(existing.isRegExp ?? false);
      setMethod(existing.method);
      prevMethod.current = existing.method;
      setEnabled(existing.enabled);
      setRequestBody(existing.requestBody ?? '');
      setResponse(existing.response || '');
      setStatusCode(existing.statusCode ?? 200);
      setDelayMs(existing.delayMs ?? null);
    }
    initialized.current = true;
  }, [existing, mode]);

  useEffect(() => {
    if (initialized.current && prevMethod.current !== method) {
      if (!methodSupportsRequestBody(method)) {
        setRequestBody('');
      }
      prevMethod.current = method;
    }
  }, [method]);

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

  const schema = z.object({
    urlPattern: z.string().nonempty('URL Pattern is required'),
    method: z.enum(['', 'GET', 'POST', 'PUT', 'DELETE']),
    requestBody: z
      .string()
      .transform((val) => (val.trim() === '' ? null : val))
      .optional(),
    statusCode: z
      .number()
      .refine((v) => Number.isInteger(v), 'Status Code must be an integer')
      .refine(
        (v) => v >= 100 && v <= 599,
        'Status Code must be between 100 and 599'
      ),
    response: z.string(),
    delayMs: z.optional(z.number().refine((v) => v >= 0, 'Delay must be >= 0')),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (patternError) {
      return;
    }

    const result = schema.safeParse({
      urlPattern,
      method,
      requestBody,
      statusCode,
      response,
      delayMs: delayMs ?? undefined,
    });

    const sanitizedRequestBody = requestBody.trim() === '' ? null : requestBody;

    if (!result.success) {
      const fieldErrs: typeof errors = {};
      result.error.errors.forEach(
        (err: { path: (string | number)[]; message: string }) => {
          const key = err.path[0] as keyof typeof errors;
          fieldErrs[key] = err.message;
        }
      );
      setErrors(fieldErrs);
      return;
    }

    setErrors({});

    if (mode === 'add') {
      dispatch(
        addRule({
          urlPattern,
          isRegExp,
          method,
          enabled,
          date: new Date().toISOString().split('T')[0],
          requestBody: sanitizedRequestBody,
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
            requestBody: sanitizedRequestBody,
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
          urlError={errors.urlPattern}
          methodError={errors.method}
        />
        <OptionsFields
          enabled={enabled}
          setEnabled={setEnabled}
          delayMs={delayMs ?? null}
          setDelayMs={setDelayMs}
          delayMsError={errors.delayMs}
        />
        <RequestOverrideFields
          requestBody={requestBody}
          setRequestBody={setRequestBody}
          disabled={!methodSupportsRequestBody(method)}
        />
        <ResponseOverrideFields
          response={response}
          setResponse={setResponse}
          statusCode={statusCode}
          setStatusCode={setStatusCode}
          responseError={errors.response}
          statusCodeError={errors.statusCode}
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
