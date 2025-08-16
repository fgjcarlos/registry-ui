import React from 'react';

interface ContainerWrapperProps {
  children: React.ReactNode;
}

const ContainerWrapper: React.FC<ContainerWrapperProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
};

export default React.memo(ContainerWrapper);
