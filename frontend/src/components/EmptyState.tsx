import React from 'react';

const EmptyState: React.FC<{ message?: string }> = ({ message = 'No data available.' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <p className="text-base-content/70">{message}</p>
    </div>
  );
};

export default EmptyState;
