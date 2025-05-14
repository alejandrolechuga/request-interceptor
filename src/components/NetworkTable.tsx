import React from 'react';
import './style.css';
import mockRequests from '../mocks/requests.json';
import Button from '@mui/material/Button';
import { clsx } from 'clsx'; // Import clsx instead of cn

export interface Request {
  id: string;
  url: string;
  status: number;
  response: string;
}

interface NetworkTableProps {
  requests: Request[];
}

interface TruncateUrlProps {
  url: string;
  maxLength?: number; // Optional: Allow customizing the maximum length
  className?: string; // Optional: Allow additional CSS classes
}

const TruncateUrl: React.FC<TruncateUrlProps> = ({
  url,
  maxLength = 200,
   className, 
  }) => {
  const truncatedUrl =
  url.length > maxLength ? url.substring(0, maxLength) + '...' : url;

  return (
      <a
        href={url}
        title={url}
        target="_blank" // Good practice for external links
        rel="noopener noreferrer" // Important for security with target="_blank"
        className={clsx(
          'truncate-url', // Base class
          className,       // Allow additional classes
          'text-white-500 hover:underline', // Basic link styling
          'whitespace-nowrap overflow-hidden text-ellipsis', // Core truncation
          'max-w-[200px]' // Default max width, can be overridden by className
        )}
      >
        {truncatedUrl}
      </a>
  );
};

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
              <td title={request.url}>                  
                <TruncateUrl url={request.url} maxLength={50} />
              </td>
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
