import React, { useEffect, useRef, useState } from 'react';

interface FilterProps {
  value: string;
  onFilterChange: (value: string) => void;
}

const DEBOUNCE_DELAY = 200;

const Filter: React.FC<FilterProps> = ({ value, onFilterChange }) => {
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onFilterChange(inputValue);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [inputValue, onFilterChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setInputValue('');
    onFilterChange('');
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Type out to filter list"
        value={inputValue}
        onChange={handleChange}
      />
      <button type="button" onClick={handleClear}>
        Clear
      </button>
    </div>
  );
};

export default Filter;
