import React from 'react';
import Logo from './Logo';

const HomeHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <Logo className="mb-4" />
      <h1 className="text-3xl font-bold text-base-content mb-2">
        Welcome to <span className="text-primary">Registry UI</span>
      </h1>
      <p className="text-base-content/70">Connect to your Docker registry</p>
    </div>
  );
};

export default HomeHeader;
