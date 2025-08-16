import React from 'react';
import Header from './Header';

interface DashboardStateProps {
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardState: React.FC<DashboardStateProps> = ({ onLogout, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-base-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <Header onLogout={onLogout} />

        {/* Content */}
        {children}
      </div>
    </div>
  );
};

const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
      <p className="text-base-content/70">Loading...</p>
    </div>
  );
};

export default DashboardState;
export { LoadingState };
