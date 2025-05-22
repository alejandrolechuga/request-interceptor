import React from 'react';
import type { Rule } from '../types/rule';
import { RuleColumn } from './columnConfig';
import { useAppDispatch } from '../store';
import { removeRule, updateRule } from '../Panel/ruleset/rulesetSlice';
import ToggleButton from './ToggleButton';

interface RuleRowProps {
  rule: Rule;
  columns: RuleColumn[];
  onEdit: (id: string) => void;
}

const RuleRow: React.FC<RuleRowProps> = ({ rule, columns, onEdit }) => {
  const dispatch = useAppDispatch();
  const handleDelete = () => dispatch(removeRule(rule.id));
  const handleEdit = () => onEdit(rule.id);

  const renderCell = (column: RuleColumn): React.ReactNode => {
    switch (column) {
      case RuleColumn.UrlPattern:
        return (
          <p title={rule.urlPattern} className="max-w-[300px] truncate">
            {rule.urlPattern}
          </p>
        );
      case RuleColumn.Method:
        return rule.method;
      case RuleColumn.Enabled:
        return (
          <ToggleButton
            isEnabled={rule.enabled}
            onToggle={() =>
              dispatch(
                updateRule({ id: rule.id, changes: { enabled: !rule.enabled } })
              )
            }
          />
        );
      case RuleColumn.Actions:
      default:
        return (
          <>
            <button
              type="button"
              onClick={handleEdit}
              className="mr-2 text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </>
        );
    }
  };

  return (
    <tr className="even:bg-gray-800/50">
      {columns.map((column) => (
        <td key={column} className="border-b px-2 py-1">
          {renderCell(column)}
        </td>
      ))}
    </tr>
  );
};

export default RuleRow;
