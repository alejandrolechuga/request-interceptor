import React from 'react';
import './style.css';

export interface Rule {
  id: string;
  urlPattern: string;
  method: string;
  enabled: boolean;
  date: string;
}

interface RuleTableProps {
  rules: Rule[];
}

const RuleTable: React.FC<RuleTableProps> = ({ rules }) => {
  return (
    <table>
      <thead>
        <tr>
          <th className="header">URL Pattern</th>
          <th className="header">Method</th>
          <th className="header">Enabled</th>
          <th className="header">Date</th>
        </tr>
      </thead>
      <tbody>
        {rules.length > 0 ? (
          rules.map((rule) => (
            <tr key={rule.id}>
              <td>
                <p title={rule.urlPattern} className="truncated-url">
                  {rule.urlPattern}
                </p>
              </td>
              <td>{rule.method}</td>
              <td>{rule.enabled ? 'Yes' : 'No'}</td>
              <td>{rule.date}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} style={{ textAlign: 'center' }}>
              No rules available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default RuleTable;
