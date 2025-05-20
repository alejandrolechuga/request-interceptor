import React from 'react';

interface FilterProps {
  value: string;
  onFilterChange: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({ value, onFilterChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange(e.target.value);
  };

  const handleClear = () => {
    onFilterChange('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type out to filter list"
        value={value}
        onChange={handleChange}
      />
      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
};

export default Filter;
