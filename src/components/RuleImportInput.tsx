import React, { useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Rule } from '../types/rule';

interface RuleImportInputProps {
  onParsed: (rules: Rule[]) => void;
  onError: (msg: string) => void;
}

const RuleImportInput: React.FC<RuleImportInputProps> = ({
  onParsed,
  onError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateRule = (rule: Partial<Rule>): rule is Rule =>
    typeof rule.urlPattern === 'string' &&
    typeof rule.method === 'string' &&
    typeof rule.enabled === 'boolean' &&
    typeof rule.statusCode === 'number';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        if (Array.isArray(json) && json.every(validateRule)) {
          const imported: Rule[] = json.map((r) => ({
            id: r.id ?? uuidv4(),
            urlPattern: r.urlPattern,
            isRegExp: r.isRegExp ?? false,
            method: r.method,
            enabled: r.enabled,
            statusCode: r.statusCode,
            date: r.date ?? new Date().toISOString().split('T')[0],
            response: r.response ?? null,
          }));
          onParsed(imported);
        } else {
          onError('Invalid rules file');
        }
      } catch {
        onError('Failed to parse rules file');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const triggerImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={triggerImport}
        className="rounded bg-blue-500 px-2 py-1"
      >
        Import Rules
      </button>
    </>
  );
};

export default RuleImportInput;
