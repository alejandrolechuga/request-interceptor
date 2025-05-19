import React from 'react';
import './style.css';

export interface Request {
  id: string;
  url: string;
  status: number;
  response: string;
}

interface NetworkTableProps {
  requests: Request[];
}

const NetworkTable: React.FC<NetworkTableProps> = ({ requests }) => {
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
        {requests.length > 0 ? (
          requests.map((request) => (
            <tr key={request.id}>
              <td>
                <p title={request.url} className="truncated-url">
                  {request.url}
                </p>
              </td>
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
