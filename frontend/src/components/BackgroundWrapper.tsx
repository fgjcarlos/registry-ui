import React from 'react';

interface BackgroundWrapperProps {
  children: React.ReactNode;
}

const BackgroundWrapper: React.FC<BackgroundWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      {children}
    </div>
  );
};

export default BackgroundWrapper;
