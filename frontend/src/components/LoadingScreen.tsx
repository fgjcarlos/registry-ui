import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center">
      <div className="loading loading-spinner loading-lg text-primary" />
    </div>
  );
};

export default LoadingScreen;
