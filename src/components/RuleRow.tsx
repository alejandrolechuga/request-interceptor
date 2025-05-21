import React from 'react';
import type { Rule } from '../types/rule';
import { RuleColumn } from './columnConfig';
import './RuleRow.css';

interface RuleRowProps {
  rule: Rule;
  columns: RuleColumn[];
}

const renderCell = (column: RuleColumn, rule: Rule): React.ReactNode => {
  switch (column) {
    case RuleColumn.UrlPattern:
      return (
        <p title={rule.urlPattern} className="truncated-url">
          {rule.urlPattern}
        </p>
      );
    case RuleColumn.Method:
      return rule.method;
    case RuleColumn.Enabled:
      return rule.enabled ? 'Yes' : 'No';
    case RuleColumn.Date:
      return rule.date;
    case RuleColumn.Actions:
    default:
      return (
        <>
          <button type="button">Edit</button>
          <button type="button">Delete</button>
        </>
      );
  }
};

const RuleRow: React.FC<RuleRowProps> = ({ rule, columns }) => {
  return (
    <tr>
      {columns.map((column) => (
        <td key={column}>{renderCell(column, rule)}</td>
      ))}
    </tr>
  );
};

export default RuleRow;
