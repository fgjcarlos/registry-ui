import {getRequestConfig} from 'next-intl/server';
import { getUserLocale } from './i18n.services';

export default getRequestConfig(async () => {
  const rawLocale = await getUserLocale();
  const locale = rawLocale === 'es' ? 'es' : 'en';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});