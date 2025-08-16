import { create } from "zustand";
import { defaultLocale, Locale } from "./config";


interface I18nStore {
    lang: Locale
    setLang: (lang: Locale) => void;
    getLang: () => Locale;
}

export const i18nStore = create<I18nStore>((set, get) => ({
    lang: defaultLocale,
    setLang: (lang: Locale) => set({ lang }),
    getLang: () => get().lang,
}))