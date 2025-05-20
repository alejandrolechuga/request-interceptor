import React from 'react';
import './style.css';
import RuleRow from './RuleRow';

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
          <th className="header">Edit</th>
        </tr>
      </thead>
      <tbody>
        {rules.length > 0 ? (
          rules.map((rule) => <RuleRow key={rule.id} rule={rule} />)
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
