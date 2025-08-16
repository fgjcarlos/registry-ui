import 'next-intl';

declare module 'next-intl' {
  interface AppConfig {
    // Union of available locales in the app
    Locale: 'en' | 'es';
  }
}
