import React from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { FiLogOut } from 'react-icons/fi';
import Logo from './Logo';
import Button from './Button';
import { useAppStore } from '@/store/useAppStore';
import { useTranslations } from 'next-intl';

// ...props handled internally; keep component focused on store-driven session

type NewHeaderProps = {
  onRefresh?: () => void;
  onLogout?: () => void;
};

const Header: React.FC<NewHeaderProps> = ({ onRefresh, onLogout }) => {

  const storeUser = useAppStore((s) => s.user);
  const displayUsername = storeUser?.username ?? '';
  const t = useTranslations('feature');

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <Logo size="sm" />
        <div>
          <h1 className="text-2xl font-bold text-base-content">{t('header.title')}</h1>
          <p className="text-base-content/70">{t('header.connectedAs', { username: displayUsername })}</p>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {onRefresh && (
            <Button variant="ghost" size="md" onClick={onRefresh}>
            <FiRefreshCw className="inline-block mr-1" /> {t('header.refresh')}
          </Button>
        )}
        <Button variant="ghost" size="md" onClick={onLogout}>
          <FiLogOut className="inline-block mr-1" /> {t('header.logout')}
        </Button>
      </div>
    </div>
  );
};

export default Header;
