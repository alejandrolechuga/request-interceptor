import React from 'react';
import './style.css';
import mockRequests from '../mocks/requests.json';
import Button from '@mui/material/Button';

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
    // Implement your view logic here.  For this example, we'll just log to the console.
    console.log('View clicked for request:', request);
    // In a real application, you'd likely open a modal, navigate to a new page, etc.
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
                <Button size="medium" onClick={() => handleViewClick(request)}>
                  View
                </Button>
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
