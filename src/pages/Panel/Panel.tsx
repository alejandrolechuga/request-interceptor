import React from 'react';

import './Panel.css';
import NetworkTable from '../../components/NetworkTable';

const Panel: React.FC = () => {
  return (
    <div className="container">
      <h1>Dev Tools Panel</h1>
      <div>
        <NetworkTable requests={[]} />
      </div>
    </div>
  );
};

export default Panel;
