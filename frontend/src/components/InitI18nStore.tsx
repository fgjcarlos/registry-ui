'use client'

import { Locale } from "@/i18n/config"
import { i18nStore } from "@/i18n/i18nStore"
import { useEffect } from "react"

type Props = {
    lang: Locale
}

export function InitI18nStore({ lang }: Props) {

    const setLocale = i18nStore(s => s.setLang)

    useEffect(() => {
        setLocale(lang)
    }, [lang, setLocale])


    return null

}