import React, { useState } from 'react';
import Filter from './Filter';
import RuleTable from './RuleTable';

interface RuleListProps {
  onEdit: (id: string) => void;
  onAdd: () => void;
}

const RuleList: React.FC<RuleListProps> = ({ onEdit, onAdd }) => {
  const [filter, setFilter] = useState('');
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Filter value={filter} onFilterChange={setFilter} />
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
