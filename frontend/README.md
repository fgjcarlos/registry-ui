[![CI](https://github.com/fgjcarlos/registry-ui/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/fgjcarlos/registry-ui/actions/workflows/ci.yml)

````markdown
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Internationalization (i18n)

This project uses `next-intl` to provide translations for the App Router.

- Locales live under `src/locales/` as JSON files (e.g. `en.json`, `es.json`).
- The root `layout.tsx` loads messages based on the `locale` route param and provides `NextIntlProvider`.
- Use `useTranslations()` in components to read translations, e.g. `const t = useTranslations(); t('login.connect')`.

To add a new language:

1. Create `src/locales/xx.json` with translation keys.
2. Update your routes or provide the `locale` param when rendering pages.
````
