"use client";

import { createContext, useCallback, useContext, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { type Locale, getTranslation } from "@/shared/lib/i18n";

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: ReturnType<typeof getTranslation>;
}

const DEFAULT_LOCALE: Locale = "zh";
const SUPPORTED_LOCALES: Locale[] = ["zh", "ja", "en"];
const LOCALE_CHANGE_EVENT = "luoxueer:locale-change";

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const isSupportedLocale = (locale: string | null): locale is Locale =>
  Boolean(locale && SUPPORTED_LOCALES.includes(locale as Locale));

const resolveBrowserLocale = (): Locale => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  const savedLocale = window.localStorage.getItem("locale");
  if (isSupportedLocale(savedLocale)) {
    return savedLocale;
  }

  const browserLang = window.navigator.language.toLowerCase();
  if (browserLang.startsWith("ja")) {
    return "ja";
  }
  if (browserLang.startsWith("en")) {
    return "en";
  }

  return DEFAULT_LOCALE;
};

const subscribeToLocale = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === "locale") {
      onStoreChange();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  };
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeToLocale, resolveBrowserLocale, () => DEFAULT_LOCALE);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((newLocale: Locale) => {
    window.localStorage.setItem("locale", newLocale);
    window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: getTranslation(locale) }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}
