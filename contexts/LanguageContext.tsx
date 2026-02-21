"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  type Lang,
  getStoredLang,
  setStoredLang,
  t as translate,
} from "@/lib/translations";

type T = (key: string) => string;

const LanguageContext = createContext<{
  lang: Lang;
  setLang: (value: Lang) => void;
  t: T;
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("Kr");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLangState(getStoredLang());
    setMounted(true);
  }, []);

  const setLang = useCallback((value: Lang) => {
    setLangState(value);
    setStoredLang(value);
  }, []);

  const t: T = useCallback(
    (key: string) => (mounted ? translate(lang, key) : translate("Kr", key)),
    [lang, mounted]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
}
