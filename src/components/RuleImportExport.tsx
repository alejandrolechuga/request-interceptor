import React, { useState } from 'react';
import { useAppDispatch } from '../store';
import { setRules } from '../Panel/ruleset/rulesetSlice';
import type { Rule } from '../types/rule';
import RuleExportButton from './RuleExportButton';
import RuleImportInput from './RuleImportInput';
import RuleImportConfirm from './RuleImportConfirm';

interface RuleImportExportProps {
  rules: Rule[];
}

const RuleImportExport: React.FC<RuleImportExportProps> = ({ rules }) => {
  const dispatch = useAppDispatch();
  const [message, setMessage] = useState('');
  const [pendingImport, setPendingImport] = useState<Rule[] | null>(null);

  const handleImported = (imported: Rule[]) => {
    if (rules.length) {
      setPendingImport(imported);
    } else {
      dispatch(setRules([...rules, ...imported]));
      setMessage('Rules imported successfully');
    }
  };

  const handleError = (msg: string) => {
    setMessage(msg);
  };

  const handleConfirmImport = () => {
    if (pendingImport) {
      dispatch(setRules([...rules, ...pendingImport]));
      setMessage('Rules imported successfully');
      setPendingImport(null);
    }
  };

  const handleCancelImport = () => {
    setPendingImport(null);
  };

  return (
    <>
      {message && (
        <p role="status" className="text-sm text-blue-700">
          {message}
        </p>
      )}
      {pendingImport && (
        <RuleImportConfirm
          onConfirm={handleConfirmImport}
          onCancel={handleCancelImport}
        />
      )}
      <RuleExportButton rules={rules} onMessage={setMessage} />
      <RuleImportInput onParsed={handleImported} onError={handleError} />
    </>
  );
};

export default RuleImportExport;
