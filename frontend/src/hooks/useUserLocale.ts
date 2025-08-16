'use client'

import { useEffect } from "react"
import { Locale, locales } from "@/i18n/config"
import { getCookieLocale, setUserLocale } from "@/i18n/i18n.services"
export function useUserLocale() {
    useEffect(() => {

        const checkUserLocale = async () => {

            const userLocale = await getCookieLocale()

            const navigatorLanguage = navigator.language as Locale

            if (!userLocale && locales.includes(navigatorLanguage)) {
                setUserLocale(navigator.language as Locale)
            }

        }

        checkUserLocale()
    }, [])
}