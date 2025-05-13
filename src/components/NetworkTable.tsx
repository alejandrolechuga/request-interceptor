import React from 'react';
import './style.css';
import mockRequests from '../mocks/requests.json';

export interface Request {
  id: string;
  url: string;
  status: number;
  response: string;
}

interface NetworkTableProps {
  requests: Request[];
}

const NetworkTable: React.FC<NetworkTableProps> = () => {
  return (
    <table>
      <thead>
        <tr>
          <th className="header">URL</th>
          <th className="header">Status</th>
          <th className="header">Response</th>
        </tr>
      </thead>
      <tbody>

        {mockRequests.map((request) => (
          <tr key={request.id}>
            <td>{request.url}</td>
            <td>{request.status}</td>
            <td>{request.response}</td>
          </tr>
        ))}

      </tbody>
    </table>
  );
};

export default NetworkTable;
