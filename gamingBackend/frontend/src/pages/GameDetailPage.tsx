import React from 'react';
import { useParams } from 'react-router-dom';

const GameDetailPage: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-text-primary">Game Details</h1>
      <div className="card">
        <p className="text-text-muted">Game detail page for ID: {id}</p>
      </div>
    </div>
  );
};

export default GameDetailPage;
