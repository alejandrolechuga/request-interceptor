import React from 'react';

export type ToggleButtonProps = {
  isEnabled: boolean;
  onToggle: () => void;
  enabledLabel?: string;
  disabledLabel?: string;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
  isEnabled,
  onToggle,
  enabledLabel = 'Enabled',
  disabledLabel = 'Disabled',
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`px-3 py-1 rounded text-sm font-medium transition ${
      isEnabled
        ? 'bg-green-600 text-white hover:bg-green-700'
        : 'bg-gray-500 text-white hover:bg-gray-600'
    }`}
  >
    {isEnabled ? enabledLabel : disabledLabel}
  </button>
);

export default ToggleButton;
