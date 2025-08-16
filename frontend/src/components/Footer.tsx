import React from 'react';
import { useTranslations } from 'next-intl';

const Footer: React.FC = () => {
  const t = useTranslations("feature");
  return (
    <div className="text-center mt-8">
      <p className="text-sm text-base-content/50">{t('footer.poweredBy', { provider: 'Docker Registry API' })}</p>
    </div>
  );
};

export default Footer;
