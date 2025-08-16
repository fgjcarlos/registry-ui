import React from 'react';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-error text-6xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-base-content mb-2">Error</h2>
      <p className="text-base-content/70 mb-6 text-center max-w-md">{error}</p>
    </div>
  );
};

  export default React.memo(ErrorState);
