import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InitI18nStore } from "@/components/InitI18nStore";
import { Locale } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";
import messages from '../../messages/en.json';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Registry UI",
  description: "A user-friendly interface for managing your image registry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Use the default english messages for now. They are namespaced under `feature`.
  const locale = 'en';

  // The JSON import has a loose type; cast via `unknown` into a safer shape to avoid `any`.
  type Messages = Record<string, Record<string, unknown>>;
  const msgs = messages as unknown as Messages;

  return (
    <html lang={locale} data-theme="cyberpunk">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-300`}>
        <NextIntlClientProvider messages={msgs}>
          <InitI18nStore lang={locale as Locale} />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
