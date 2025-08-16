'use server'

import { cookies } from "next/headers"
import { MAX_AGE } from "./config"

export async function changeLocale({ locale }: { locale: string }) {

    const cookiesStore = await cookies()

    cookiesStore.set('NEXT_LOCALE', locale, {
        maxAge: MAX_AGE,  // 30 days
    })
}

export async function getLocale() {

    const cookiesStore = await cookies()

    return cookiesStore.get('NEXT_LOCALE')
}