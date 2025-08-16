import React from 'react';
import { useTranslations } from 'next-intl';
import Logo from './Logo';

const HomeHeader: React.FC = () => {
  const t = useTranslations('feature');

  return (
    <div className="text-center mb-8">
      <Logo className="mb-4" />
      <h1 className="text-3xl font-bold text-base-content mb-2">
        {t('home.welcomePrefix')} <span className="text-primary">Registry UI</span>
      </h1>
      <p className="text-base-content/70">{t('home.connectDescription')}</p>
    </div>
  );
};

export default HomeHeader;
