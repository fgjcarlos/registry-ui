import React from 'react';
import Header from './Header';

interface DashboardStateProps {
  username: string;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardState: React.FC<DashboardStateProps> = ({ username, onLogout, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header username={username} onLogout={onLogout} />

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

export default DashboardState;
