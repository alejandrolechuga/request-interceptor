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
  const handleViewClick = (request: Request) => {
    console.log('View clicked for request:', request);
  };
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
        {mockRequests.length > 0 ? (
          mockRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.url}</td>
              <td>{request.status}</td>
              <td>
                <button onClick={() => handleViewClick(request)}>
                  View Response
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} style={{ textAlign: 'center' }}>
              No requests available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default NetworkTable;
