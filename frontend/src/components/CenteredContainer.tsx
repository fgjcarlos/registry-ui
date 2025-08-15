import React from 'react';

interface CenteredContainerProps {
  children: React.ReactNode;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
      {children}
    </div>
  );
};

export default CenteredContainer;
