import React, { useState } from 'react';
import Filter from './Filter';
import RuleTable from './RuleTable';
import { useAppSelector } from '../store';

interface RuleListProps {
  onEdit: (id: string) => void;
  onAdd: () => void;
}

const RuleList: React.FC<RuleListProps> = ({ onEdit, onAdd }) => {
  const [filter, setFilter] = useState('');
  const rulesCount = useAppSelector((state) => state.ruleset.length);
  return (
    <div className="space-y-4">
      <div className="flex justify-end gap-2">
        {rulesCount > 10 && (
          <Filter value={filter} onFilterChange={setFilter} />
        )}
        <button
          type="button"
          onClick={onAdd}
          className="rounded bg-green-600 px-2 py-1"
        >
          Add Rule
        </button>
      </div>
      <RuleTable filter={filter} onEdit={onEdit} />
    </div>
  );
};

export default RuleList;
