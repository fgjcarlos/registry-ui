export type Locale = (typeof locales)[number];

export const locales = ['es','en'] as const;
export const defaultLocale: Locale = 'en';

export const MAX_AGE = 30 * 24 * 60 * 60
export const DEFAULT_LOCALE = 'en'