import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Lang = 'ar' | 'en'
export type L = { ar: string; en: string }

type Ctx = {
  lang: Lang
  dir: 'rtl' | 'ltr'
  setLang: (l: Lang) => void
  toggle: () => void
  /** t('عربي', 'English') or t({ ar, en }) */
  t: (ar: string | L, en?: string) => string
}

const LangContext = createContext<Ctx | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  // Arabic is the default. Nothing is persisted: no storage, no tracking.
  const [lang, setLang] = useState<Lang>('ar')
  const dir = lang === 'ar' ? 'rtl' : 'ltr'

  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang, dir])

  const t = useCallback(
    (ar: string | L, en?: string) => (typeof ar === 'string' ? (lang === 'ar' ? ar : en ?? ar) : ar[lang]),
    [lang],
  )

  const value = useMemo<Ctx>(
    () => ({ lang, dir, setLang, toggle: () => setLang((l) => (l === 'ar' ? 'en' : 'ar')), t }),
    [lang, dir, t],
  )
  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
