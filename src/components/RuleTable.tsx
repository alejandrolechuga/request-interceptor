import React, { useMemo } from 'react';
import './style.css';
import RuleRow from './RuleRow';
import { useAppSelector } from '../store';
import { COLUMN_ORDER, COLUMN_LABELS, RuleColumn } from './columnConfig';

interface RuleTableProps {
  filter?: string;
}

const RuleTable: React.FC<RuleTableProps> = ({ filter = '' }) => {
  const rules = useAppSelector((state) => state.ruleset);
  const filteredRules = useMemo(() => {
    if (!filter) return rules;
    return rules.filter((rule) =>
      rule.urlPattern.toLowerCase().includes(filter.toLowerCase())
    );
  }, [filter, rules]);

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
        {filteredRules.length > 0 ? (
          filteredRules.map((rule) => (
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
