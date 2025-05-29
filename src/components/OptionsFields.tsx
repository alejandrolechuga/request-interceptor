import React from 'react';

export interface OptionsFieldsProps {
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

const OptionsFields: React.FC<OptionsFieldsProps> = ({
  enabled,
  setEnabled,
}) => (
  <fieldset className="flex flex-col gap-2 rounded border p-2">
    <legend className="text-sm font-semibold">Options</legend>
    <label className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
      />
      Enable Rule
    </label>
  </fieldset>
);

export default OptionsFields;
