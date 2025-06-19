import React from 'react';

export interface RequestOverrideFieldsProps {
  requestBody: string;
  setRequestBody: (value: string) => void;
}

const RequestOverrideFields: React.FC<RequestOverrideFieldsProps> = ({
  requestBody,
  setRequestBody,
}) => (
  <fieldset className="flex flex-col gap-2 rounded border p-2">
    <legend className="text-sm font-semibold">Override Request Body</legend>
    <label className="flex flex-col">
      <span>Override Request Body</span>
      <textarea
        id="requestBody"
        name="requestBody"
        rows={4}
        value={requestBody}
        onChange={(e) => setRequestBody(e.target.value)}
        placeholder='{"foo": "bar"}'
        className="rounded border border-gray-300 px-2 py-1 text-black"
      />
    </label>
  </fieldset>
);

export default RequestOverrideFields;
