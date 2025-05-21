import React from 'react';

import RuleRow from './RuleRow';
import type { Rule } from '../types/rule';
import { COLUMN_ORDER, COLUMN_LABELS, RuleColumn } from './columnConfig';

interface RuleTableProps {
  rules: Rule[];
}

const RuleTable: React.FC<RuleTableProps> = ({ rules }) => {
  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100">
          <tr>
            {COLUMN_ORDER.map((column) => (
              <th
                key={column}
                className="px-3 py-2 font-semibold text-gray-700"
              >
                {COLUMN_LABELS[column]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rules.length > 0 ? (
            rules.map((rule) => (
              <RuleRow key={rule.id} rule={rule} columns={COLUMN_ORDER} />
            ))
          ) : (
            <tr>
              <td colSpan={COLUMN_ORDER.length} className="py-4 text-center">
                No rules available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RuleTable;
