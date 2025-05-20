import React from 'react';
import './style.css';
import RuleRow from './RuleRow';
import type { Rule } from '../types/rule';
import { COLUMN_ORDER, COLUMN_LABELS, RuleColumn } from './columnConfig';

interface RuleTableProps {
  rules: Rule[];
}

const RuleTable: React.FC<RuleTableProps> = ({ rules }) => {
  return (
    <table>
      <thead>
        <tr>
          {COLUMN_ORDER.map((column) => (
            <th key={column} className="header">
              {COLUMN_LABELS[column]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rules.length > 0 ? (
          rules.map((rule) => (
            <RuleRow key={rule.id} rule={rule} columns={COLUMN_ORDER} />
          ))
        ) : (
          <tr>
            <td colSpan={COLUMN_ORDER.length} style={{ textAlign: 'center' }}>
              No rules available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RuleTable;
