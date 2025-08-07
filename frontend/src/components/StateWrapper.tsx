import React from 'react';

interface StateWrapperProps {
  isLoading?: boolean;
  error?: string;
  empty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

const StateWrapper: React.FC<StateWrapperProps> = ({ isLoading, error, empty, emptyMessage, children }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
        <p className="text-base-content/70">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-error text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-base-content mb-2">Error</h2>
        <p className="text-base-content/70 mb-6 text-center max-w-md">{error}</p>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-base-content/70">{emptyMessage || 'No data available.'}</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default StateWrapper;
