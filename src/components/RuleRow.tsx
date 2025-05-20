import React from 'react';
import type { Rule } from './RuleTable';
import './RuleRow.css';

interface RuleRowProps {
  rule: Rule;
}

const RuleRow: React.FC<RuleRowProps> = ({ rule }) => {
  return (
    <tr>
      <td>
        <p title={rule.urlPattern} className="truncated-url">
          {rule.urlPattern}
        </p>
      </td>
      <td>{rule.method}</td>
      <td>{rule.enabled ? 'Yes' : 'No'}</td>
      <td>{rule.date}</td>
      <td>
        <button type="button">Edit</button>
      </td>
    </tr>
  );
};

export default RuleRow;
