import React from 'react';
import { useTranslations } from 'next-intl';

const HelpSection: React.FC = () => {
  const t = useTranslations("feature");
  return (
    <div className="text-center mt-6">
      <p className="text-sm text-base-content/60">
        {t('help.needHelp')} <a href="https://docs.docker.com/registry/" className="link link-primary" target="_blank" rel="noopener noreferrer">{t('help.documentation')}</a>
      </p>
    </div>
  );
};

export default React.memo(HelpSection);
