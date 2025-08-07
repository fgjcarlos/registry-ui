import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';
import Logo from './Logo';
import Button from './Button';

interface HeaderProps {
  username: string;
  onLogout: () => void;
  onRefresh?: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout, onRefresh }) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Logo size="sm" />
        <div>
          <h1 className="text-2xl font-bold text-base-content">Registry Dashboard</h1>
          <p className="text-base-content/70">Connected as {username}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {onRefresh && (
          <Button variant="ghost" size="md" onClick={onRefresh}>
            <FiRefreshCw className="inline-block mr-1" /> Refresh
          </Button>
        )}
        <Button variant="ghost" size="md" onClick={onLogout}>
          <FiLogOut className="inline-block mr-1" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
